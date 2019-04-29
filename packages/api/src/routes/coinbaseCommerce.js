const Router = require('koa-router');
const CoinbaseWebhook = require('coinbase-commerce-node').Webhook;

const { COINBASE_COMMERCE } = require('../constants/events');

module.exports = async ({
  db,
  config: { COINBASE_COMMERCE_WEBHOOK_SHARED_SECRET },
  log: parentLog,
}) => {
  const log = parentLog.create('routes/coinbaseCommerce');

  const router = new Router();
  router.prefix('/coinbase-commerce');

  const coinbaseCommerceMiddleware = (ctx, next) => {
    try {
      CoinbaseWebhook.verifySigHeader(
        JSON.stringify(ctx.request.body),
        ctx.request.headers['x-cc-webhook-signature'],
        COINBASE_COMMERCE_WEBHOOK_SHARED_SECRET,
      );
    } catch (e) {
      log.error(e.message);
      ctx.throw(403);
    }

    return next();
  };

  router.post('/webhook', async ctx =>
    db.emit(COINBASE_COMMERCE, { data: ctx.request.body }),
  );

  return router;
};
