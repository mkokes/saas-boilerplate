import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';

import createLinks from './links/index';
// import { dataIdFromObject } from './ids';

const cache = new InMemoryCache();

export const clientInstance = new ApolloClient({
  cache,
  link: createLinks({ cache }),
});

export const removeTypename = item =>
  Object.keys(item).reduce((m, v) => {
    const _m = m;

    if (v !== '__typename') {
      _m[v] = item[v];
    }
    return _m;
  }, {});
