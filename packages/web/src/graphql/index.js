import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';

import createLinks from './links/index';
// import { dataIdFromObject } from './ids';

const cache = new InMemoryCache();

export const clientInstance = new ApolloClient({
  cache,
  link: createLinks({ cache }),
});
