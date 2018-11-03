import { withClientState } from 'apollo-link-state';

import resolvers, { defaults } from 'api/graphql/rootResolver';
import typeDefs from 'graphql/schema';

export default ({ cache }) =>
  withClientState({
    resolvers,
    cache,
    defaults,
    typeDefs,
  });
