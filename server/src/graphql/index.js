const { ApolloServer } = require('apollo-server-koa');

const schema = require('./schema');
const createResolvers = require('./resolvers');

module.exports = ({ config, db, server: app }) => {
  const server = new ApolloServer({
    introspection: true,
    typeDefs: schema,
    resolvers: createResolvers({ config, db }),
    context: ({
      ctx: {
        state: { user },
      },
    }) => ({ user }),
  });

  server.applyMiddleware({ app });
};
