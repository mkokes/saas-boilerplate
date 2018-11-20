import { onError } from 'apollo-link-error';
import { Observable } from 'apollo-link';
import { getProvider as getGlobalProvider } from 'GlobalState';
import { buildAuthHeader } from 'utils/requests';

/* eslint-disable no-console */
const errorLink = () =>
  onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (networkError) console.error(`[Network error]: ${networkError}`);

    if (graphQLErrors) {
      const { message, locations, path, extensions } = graphQLErrors[0];
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}, Code: ${
          extensions.code
        }`,
      );

      if (extensions.code === 'UNAUTHENTICATED') {
        return new Observable(async observer => {
          try {
            const { headers } = operation.getContext();

            const globalProvider = await getGlobalProvider();
            await globalProvider.refreshAccessToken();

            operation.setContext({
              headers: {
                ...headers,
                Authorization: buildAuthHeader(globalProvider.authAccessToken())
                  .Authorization,
              },
            });

            const subscriber = {
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            };

            // Retry last failed request
            forward(operation).subscribe(subscriber);
          } catch (e) {
            observer.error(e);
          }
        });
      }
    }
  });

export default errorLink;
