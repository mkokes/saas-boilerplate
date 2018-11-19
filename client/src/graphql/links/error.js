import { onError } from 'apollo-link-error';

import { getProvider as getGlobalProvider } from 'GlobalState';
import { buildAuthHeader } from 'utils/requests';

/* eslint-disable no-console */
const errorLink = () =>
  onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      graphQLErrors.map(async ({ message, locations, path, extensions }) => {
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}, Code: ${
            extensions.code
          }`,
        );

        if (extensions.code === 'UNAUTHENTICATED') {
          const { headers } = operation.getContext();
          const globalProvider = await getGlobalProvider();

          const newAccessToken = await globalProvider.renewAccessToken();

          console.debug({
            headers: {
              ...headers,
              Authorization: buildAuthHeader(newAccessToken).Authorization,
            },
          });

          /* operation.setContext({
            headers: {
              ...headers,
              authorization: buildAuthHeader(globalProvider.authAccessToken()),
            },
          });
          forward(operation); */
        }
      });
    }

    if (networkError) console.error(`[Network error]: ${networkError}`);
  });

export default errorLink;
