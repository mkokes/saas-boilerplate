const Koa = require('koa');
const Router = require('koa-router');
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
  const {
    APP_MODE,
    SENTRY_DSN,
    SERVER_NAME,
    MIXPANEL_TOKEN,
    PORT,
    HOST,
  } = config;

  log.info(`App mode: ${APP_MODE}`);

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: APP_MODE,
    serverName: SERVER_NAME,
  });

  const mixpanel = Mixpanel.init(MIXPANEL_TOKEN, {
    protocol: 'https',
  });
  const db = await connectDb({ config, log, mixpanel });

  await createProcessor({ config, log, db, Sentry });

  const server = new Koa();
  const router = new Router();

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

  router.get('/health', ctx => {
    ctx.status = 200;
  });

  server.use(router.routes());
  server.listen(PORT, HOST, err => {
    if (err) {
      throw err;
    }

    /* eslint-disable-next-line */
    log.info(`Listening on ${HOST}:${PORT}`);
  });
};

init().catch(err => {
  log.error(err);
  Sentry.captureException(err);
});
