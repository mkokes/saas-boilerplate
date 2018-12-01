const { ApolloServer } = require('apollo-server-koa');

const schema = require('./schema');
const createResolvers = require('./resolvers');

module.exports = ({ config, db, server: app, log: parentLog }) => {
  const log = parentLog.create('apollo');

  const server = new ApolloServer({
    introspection: true,
    typeDefs: schema,
    resolvers: createResolvers({ config, db }),
    context: ({
      ctx: {
        state: { user },
      },
    }) => ({ user }),
    formatError: error => error,
  });

  server.applyMiddleware({ app });
  log.info('initiated');
};
