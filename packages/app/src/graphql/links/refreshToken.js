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

/* eslint-disable consistent-return */
const refreshAuthTokenLink = () =>
  onError(
    ({ graphQLErrors, networkError, operation, response, forward }) =>
      new Observable(async observer => {
        if (graphQLErrors) {
          graphQLErrors.map(async ({ extensions }, index) => {
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

                    await globalProvider.logOut({ isForced: true });
                    return observer.error(graphQLErrors[index]);
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
                return observer.next(response);
            }
          });
        }

        if (networkError) {
          return observer.error(networkError);
        }
      }),
  );

export default refreshAuthTokenLink;
