const { ApolloServer } = require('apollo-server-koa');

const schema = require('./schema');
const createResolvers = require('./resolvers');

module.exports = ({ config, db, server: app, log: parentLog, mixpanel }) => {
  const log = parentLog.create('graphql');

  const resolvers = createResolvers({ config, db, log, mixpanel });
  if (config.APP_MODE === 'dev') {
    /* eslint-disable-next-line */
    const createGraphQLLogger = require('graphql-log');
    const logExecutions = createGraphQLLogger({
      logger: log.debug,
    });
    logExecutions(resolvers);
  }

  const server = new ApolloServer({
    introspection: true,
    typeDefs: schema,
    resolvers,
    context: ({
      ctx: {
        state: { user },
      },
    }) => ({ user }),
    formatError: error => error,
  });

  server.applyMiddleware({ app });
};
