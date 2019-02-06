const setupApiPrivateRouting = require('./api/private');
const setupPaddleRouting = require('./paddle');

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
