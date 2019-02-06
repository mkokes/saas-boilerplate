const Koa = require('koa');
const cors = require('@koa/cors');
const koaBody = require('koa-body');
const Sentry = require('@sentry/node');
const Mixpanel = require('mixpanel');

const config = require('./config');
const log = require('./log')(config);
const connectDb = require('./db');
const createProcessor = require('./processor');
const setupRoutes = require('./routes');
const setupAuthMiddleware = require('./auth');
const setupGraphQLEndpoint = require('./graphql');

const init = async () => {
  log.info(`App mode: ${config.APP_MODE}`);

  Sentry.init({
    dsn: config.SENTRY_DSN,
    environment: config.APP_MODE,
    serverName: config.SERVER_NAME,
  });

  const mixpanel = Mixpanel.init(config.MIXPANEL_TOKEN, {
    protocol: 'https',
  });

  const db = await connectDb({ config, log, mixpanel });
  await createProcessor({ config, log, db, Sentry });

  const server = new Koa();

  server.use(koaBody());
  server.use(
    cors({
      origin: '*',
      credentials: true,
    }),
  );

  server.use(async (ctx, nextHandler) => {
    ctx.res.statusCode = 200;
    await nextHandler();
  });

  setupRoutes({ config, db, server, log });
  setupAuthMiddleware({ config, db, server });
  setupGraphQLEndpoint({ config, db, server, log, mixpanel });

  server.listen(config.PORT, err => {
    if (err) {
      throw err;
    }
  });
};

init().catch(err => {
  log.error(err);
  Sentry.captureException(err);
});
