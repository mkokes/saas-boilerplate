import { onError } from 'apollo-link-error';
import { Observable } from 'apollo-link';

import { buildAuthHeader } from 'utils/requests';
import { getProvider as getGlobalProvider } from 'GlobalState';

let isFetchingToken = false;
let tokenSubscribers = [];
function subscribeTokenRefresh(cb) {
  tokenSubscribers.push(cb);
}
function onTokenRefreshed(err) {
  tokenSubscribers.map(cb => cb(err));
}

/* eslint-disable consistent-return, no-console */
const errorLink = () =>
  onError(
    ({ graphQLErrors, networkError, operation, forward }) =>
      new Observable(async observer => {
        if (networkError) {
          console.error(`[Network error]: ${networkError}`);
          return observer.error(networkError);
        }

        if (graphQLErrors) {
          const { message, locations, path, extensions } = graphQLErrors[0];
          console.error(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}, Code: ${
              extensions.code
            }`,
          );

          try {
            switch (extensions.code) {
              case 'UNAUTHENTICATED': {
                const retryRequest = () => {
                  operation.setContext({
                    headers: {
                      ...headers,
                      Authorization: buildAuthHeader(
                        globalProvider.authAccessToken(),
                      ).Authorization,
                    },
                  });

                  const subscriber = {
                    next: observer.next.bind(observer),
                    error: observer.error.bind(observer),
                    complete: observer.complete.bind(observer),
                  };

                  return forward(operation).subscribe(subscriber);
                };

                const { headers } = operation.getContext();
                const globalProvider = await getGlobalProvider();

                if (!isFetchingToken) {
                  isFetchingToken = true;

                  try {
                    await globalProvider.refreshAccessTokenReq();

                    isFetchingToken = false;
                    onTokenRefreshed(null);
                    tokenSubscribers = [];

                    return retryRequest();
                  } catch (e) {
                    onTokenRefreshed(
                      new Error('Unable to refresh access token'),
                    );

                    tokenSubscribers = [];
                    isFetchingToken = false;

                    return globalProvider.logOut(true);
                  }
                }

                const tokenSubscriber = new Promise(resolve => {
                  subscribeTokenRefresh(errRefreshing => {
                    if (!errRefreshing) return resolve(retryRequest());
                  });
                });

                return tokenSubscriber;
              }

              default:
                observer.error(graphQLErrors);
                break;
            }
          } catch (e) {
            observer.error(e);
          }
        }
      }),
  );

export default errorLink;
