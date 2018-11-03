import { Observable, ApolloLink } from 'apollo-link';
import {
  hasDirectives,
  checkDocument,
  removeDirectivesFromDocument,
} from 'apollo-utilities';

import { getProvider as getGlobalProvider } from 'GlobalState';
import { buildAuthHeaders } from 'utils/requests';

const sanitizedQueryCache = new Map();

const makeError = observer => {
  observer.complete([]);
};

export default () =>
  new ApolloLink((operation, forward) => {
    const currentOperation = operation;

    const requireAuth = hasDirectives(['requireAuth'], currentOperation.query);
    const disableAuth = hasDirectives(['disableAuth'], currentOperation.query);

    // get sanitized query (remove @auth directive since server won't understand it)
    let sanitizedQuery =
      sanitizedQueryCache[JSON.stringify(currentOperation.query)];
    if (!sanitizedQuery) {
      // remove directives
      checkDocument(currentOperation.query);
      sanitizedQuery = removeDirectivesFromDocument(
        [{ name: 'requireAuth' }, { name: 'disableAuth' }],
        currentOperation.query,
      );
      // save to cache for next time!
      sanitizedQueryCache[
        JSON.stringify(currentOperation.query)
      ] = sanitizedQuery;
    }
    // overwrite original query with sanitized version
    currentOperation.query = sanitizedQuery;

    // disable auth for this query?
    if (disableAuth) {
      return forward(currentOperation);
    }

    // build handler
    return new Observable(async observer => {
      let handle = null;

      // wait until global provider is ready
      const globalProvider = await getGlobalProvider();

      // if user is not logged in and we require auth
      if (!globalProvider.isLoggedIn() && requireAuth) {
        try {
          // try logging in
          await globalProvider.signIn();
        } catch (err) {
          return makeError(observer, err.message);
        }
      }

      // add auth headers if possible
      if (globalProvider.isLoggedIn()) {
        currentOperation.setContext({
          headers: buildAuthHeaders(globalProvider.authToken()),
        });
      }

      // pass request down the chain
      handle = forward(currentOperation).subscribe({
        next: observer.next.bind(observer),
        error: observer.error.bind(observer),
        complete: observer.complete.bind(observer),
      });

      // return unsubscribe function
      return () => {
        if (handle) {
          handle.unsubscribe();
        }
      };
    });
  });
