const setupApiPrivateRouting = require('./private');
const setupPaddleRouting = require('./paddle');

module.exports = async ({ config, db, app, log }) => {
  const apiPrivateRouter = await setupApiPrivateRouting({
    config,
    db,
    log,
  });
  const paddleRouter = await setupPaddleRouting({ db, log, app });

  app.use(apiPrivateRouter.routes());
  app.use(paddleRouter.routes());
};
