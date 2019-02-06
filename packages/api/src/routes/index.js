const setupApiPrivateRouting = require('./paddle');
const setupPaddleRouting = require('./api/private');

module.exports = async ({ config, db, server, log }) => {
  const apiPrivateRouter = await setupApiPrivateRouting({
    config,
    db,
    log,
  });
  const paddleRouter = await setupPaddleRouting({ db, log, server });

  server.use(apiPrivateRouter.routes());
  server.use(paddleRouter.routes());
};
