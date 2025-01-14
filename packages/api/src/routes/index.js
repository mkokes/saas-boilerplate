const setupApiPrivateRouting = require('./private');
const setupPaddleRouting = require('./paddle');
const setupCoinbaseCommerceRouting = require('./coinbaseCommerce');

module.exports = async ({ config, db, app, log }) => {
  const apiPrivateRouter = await setupApiPrivateRouting({
    config,
    db,
    log,
  });
  const paddleRouter = await setupPaddleRouting({ db, log, app });
  const coinbaseCommerceRouter = await setupCoinbaseCommerceRouting({
    db,
    config,
    log,
    app,
  });

  app.use(apiPrivateRouter.middleware());
  app.use(paddleRouter.middleware());
  app.use(coinbaseCommerceRouter.middleware());
};
