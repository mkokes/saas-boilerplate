const Koa = require('koa');
const cors = require('@koa/cors');
const Router = require('koa-router');

const config = require('./config');
const setupEventQueue = require('./eventQueue');
const log = require('./log')(config);
const connectDb = require('./db');
const createProcessor = require('./processor');
const setupAuthMiddleware = require('./auth');
const setupGraphQLEndpoint = require('./graphql');
const setupScheduler = require('./scheduler');

const init = async () => {
  log.info(`app mode: ${config.APP_MODE}`);

  const db = await connectDb({ config, log });
  const scheduler = setupScheduler({ log });
  const eventQueue = setupEventQueue({ log });
  await createProcessor({ config, log, eventQueue, scheduler, db });

  const server = new Koa();
  const router = new Router();

  server.use(
    cors({
      origin: '*',
      credentials: true,
    }),
  );

  server.use(async (ctx, nextHandler) => {
    // set the default statusCode.
    ctx.res.statusCode = 200;
    await nextHandler();
  });

  setupAuthMiddleware({ config, db, server, log });
  setupGraphQLEndpoint({ config, db, server, log });

  server.use(router.routes());
  server.listen(config.PORT, err => {
    if (err) {
      throw err;
    }

    log.info('server started');
  });
};

init().catch(err => {
  log.error(err);
  process.exit(-1);
});
