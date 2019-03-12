const Koa = require('koa');
const Router = require('koa-router');
const cors = require('@koa/cors');
const Sentry = require('@sentry/node');

const config = require('./config');
const log = require('./log')(config);
const createProcessor = require('./processor');

const init = async () => {
  const { APP_MODE, SENTRY_DSN, SERVER_NAME, PORT, HOST } = config;

  log.info(`App mode: ${APP_MODE}`);

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: APP_MODE,
    serverName: SERVER_NAME,
  });

  await createProcessor({ config, log, Sentry });

  const server = new Koa();
  const router = new Router();

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
