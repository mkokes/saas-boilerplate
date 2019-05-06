const Router = require('koa-joi-router');
const CoinbaseWebhook = require('coinbase-commerce-node').Webhook;

const { COINBASE_COMMERCE } = require('../constants/events');

module.exports = async ({
  db,
  config: { COINBASE_COMMERCE_WEBHOOK_SHARED_SECRET },
  log: parentLog,
}) => {
  const log = parentLog.create('routes/coinbaseCommerce');

  const coinbaseCommerceRouter = Router();
  coinbaseCommerceRouter.prefix('/coinbase-commerce');

  coinbaseCommerceRouter.route({
    method: 'post',
    path: '/webhook',
    validate: {
      type: 'json',
      failure: 400,
    },
    pre: (ctx, next) => {
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
    },
    handler: ctx => db.emit(COINBASE_COMMERCE, { data: ctx.request.body }),
  });

  return coinbaseCommerceRouter;
};
