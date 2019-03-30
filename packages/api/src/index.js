const Koa = require('koa');
const Router = require('koa-router');
const cors = require('@koa/cors');
const koaBody = require('koa-body');
const Sentry = require('@sentry/node');

const config = require('./config');
const setupEventQueue = require('./eventQueue');
const log = require('./log')(config);
const connectDb = require('./db');
const createProcessor = require('./processor');
const setupRoutes = require('./routes');
const setupAuthMiddleware = require('./auth');
const setupGraphQLEndpoint = require('./graphql');

const init = async () => {
  const {
    NODE_ENV,
    APP_MODE,
    SENTRY_DSN,
    SERVER_NAME,
    PORT,
    HOST,
    MAINTENANCE,
  } = config;

  log.info(`app mode: ${APP_MODE}`);

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: NODE_ENV,
    appMode: APP_MODE,
    serverName: SERVER_NAME,
  });

  const db = await connectDb({ config, log });
  const eventQueue = setupEventQueue({ log });

  await createProcessor({ config, log, eventQueue, db, Sentry });

  const app = new Koa();

  app.use(
    cors({
      origin: '*',
      credentials: true,
    }),
  );
  app.use(koaBody());

  if (MAINTENANCE) {
    log.info('maintenance mode enabled');
    app.use(async ctx => {
      ctx.res.statusCode = 503;
    });
  }

  app.use(async (ctx, nextHandler) => {
    ctx.res.statusCode = 200;
    await nextHandler();
  });

  setupRoutes({ config, db, app, log });
  setupAuthMiddleware({ config, db, app });
  setupGraphQLEndpoint({ config, db, app, log });

  const router = new Router();
  router.get('/health', ctx => {
    ctx.status = 200;
  });

  app.use(router.routes());
  app.listen(PORT, HOST, err => {
    if (err) {
      throw err;
    }

    log.info(`listening on ${HOST}:${PORT}`);
  });
};

init().catch(err => {
  log.error(err);
  Sentry.captureException(err);
});
