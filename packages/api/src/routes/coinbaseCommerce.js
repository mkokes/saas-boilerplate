const Router = require('koa-router');
const CoinbaseWebhook = require('coinbase-commerce-node').Webhook;

const { COINBASE_COMMERCE } = require('../constants/events');

module.exports = async ({
  db,
  config: { COINBASE_COMMERCE_WEBHOOK_SECRET },
  log: parentLog,
}) => {
  const log = parentLog.create('routes/coinbaseCommerce');

  const router = new Router();
  router.prefix('/coinbase-commerce');

  const coinbaseCommerceMiddleware = (ctx, next) => {
    try {
      CoinbaseWebhook.verifySigHeader(
        ctx.request.body,
        ctx.request.headers['X-CC-Webhook-Signature'],
        COINBASE_COMMERCE_WEBHOOK_SECRET,
      );
    } catch (e) {
      log.error(e.message);
      ctx.throw(403);
    }

    return next();
  };

  router.post('/webhook', coinbaseCommerceMiddleware, async ctx =>
    db.emit(COINBASE_COMMERCE, { event: ctx.request.body }),
  );

  return router;
};
