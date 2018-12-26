const Koa = require('koa');
const cors = require('@koa/cors');
const Router = require('koa-router');
const koaBody = require('koa-body');
const Serialize = require('php-serialize');
const crypto = require('crypto');

const config = require('./config');
const log = require('./log')(config);
const connectDb = require('./db');
const createProcessor = require('./processor');
const setupAuthMiddleware = require('./auth');
const setupGraphQLEndpoint = require('./graphql');

const init = async () => {
  log.info(`App mode: ${config.APP_MODE}`);

  const db = await connectDb({ config, log });
  await createProcessor({ config, log, db });

  const server = new Koa();

  server.use(koaBody());
  server.use(async (ctx, next) => {
    ctx.body = ctx.request.body;

    await next();
  });

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

  router.post('/paddle-webhooks', async ctx => {
    const {
      p_signature: paddleSignature,
      alert_name: eventName,
      status,
      subscription_id: paddleSubscriptionId,
      passthrough: userData,
    } = ctx.body;

    try {
      /* eslint-disable */
      function ksort(obj) {
        const keys = Object.keys(obj).sort();
        const sortedObj = {};

        for (const i in keys) {
          sortedObj[keys[i]] = obj[keys[i]];
        }

        return sortedObj;
      }

      const PADDLE_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAyI5uVjrlEEIeyFcUkTMo
LkKaZ/410F4jPFkUYRYsokFlaUvt1M/EAl3++GaLoQb7cwZ4oCxEvjBjdBFegCjr
1l/u1uBul0frrJT9xZQy0vxIslEVZTMg1vTEjtzLbRkkJGb1azec+sHJViVXmFL2
YeI1fjKG3nioDILz+72H9xLUi21Bij/ChA6imWISdC4Br8NmZkOz/LP3GcaKIQtE
7NJSHrmF6N0E7p7R/+SHR6KBO1aIrA2YCBhenJ3nC780Jg7/AFNGqwj0ltx02PUC
88QhIDmuOn6Q+QGSiDyAD+yrzsbC4DKYzYMcKTCHPK4KpaJsmFkQHyGqAhu4cbnF
ewd2zvwC/nZTJsZ2J+3ycLTNNQegGwrxTZ7/4SpNsNp46A/Lb+vXu1cPNXHePjwc
AyZQk9Hu6OTyo0MvwXa1+mhI2IwXh2n72Dgbo8C/krWD2MhwCl1oe0MvNEvs+3Y6
7uP0jxFfyMBc0mEBY+zHgCNqJBsE9zsKOkrRNUbHm9DuN3PHuPLfRPE7NskbA8dO
QYgnv0qmRy3ZdgZoZc/XoP3LlShNQawxeDbLwk5yZg333JI5bkWsG8Mlw6Z8MaZh
sAwMAnGXfJpNDrLt3jS2wbhu2XFQKoAXc8uPE5XK1NFhNdOWdxrWZUkLO4QjkAcH
agZvxrChIKHYmj+iPIbWJYMCAwEAAQ==
-----END PUBLIC KEY-----`;

      let params = ctx.body;

      const mySig = Buffer.from(params.p_signature, 'base64');
      delete params.p_signature;
      // Need to serialize array and assign to data object
      params = ksort(params);
      for (const property in params) {
        if (
          params.hasOwnProperty(property) &&
          typeof params[property] !== 'string'
        ) {
          if (Array.isArray(params[property])) {
            // is it an array
            params[property] = params[property].toString();
          } else {
            // if its not an array and not a string, then it is a JSON obj
            params[property] = JSON.stringify(params[property]);
          }
        }
      }
      const serialized = Serialize.serialize(params);
      // End serialize data object
      const verifier = crypto.createVerify('sha1');
      verifier.update(serialized);
      verifier.end();

      const verification = verifier.verify(PADDLE_PUBLIC_KEY, mySig);
      if (!verification) {
        throw new Error('INVALID_SIGNATURE');
      }

      /* eslint-enable */
    } catch (e) {
      ctx.throw(403, e.message);
    }

    const user = JSON.parse(userData);

    /* eslint-disable default-case */
    switch (eventName) {
      case 'subscription_created': {
        const {
          subscription_plan_id: paddleSubscriptionPlanId,
          checkout_id: checkoutId,
          quantity,
          unit_price: unitPrice,
          currency,
          update_url: updateURL,
          cancel_url: cancelURL,
          next_bill_date: nextBillDateAt,
        } = ctx.body;

        const plan = await db.getPlanIdByPaddleId(paddleSubscriptionPlanId);
        if (!plan) {
          throw new Error(
            `Plan not found: Paddle ID. ${paddleSubscriptionPlanId}`,
          );
        }

        await db.createSubscription(user._id, {
          _plan: plan._id,
          _user: user._id,
          _paddleSubscriptionId: paddleSubscriptionId,
          _paddlePlanId: paddleSubscriptionPlanId,
          _paddleCheckoutId: checkoutId,
          quantity,
          unitPrice,
          currency,
          updateURL,
          cancelURL,
          nextBillDateAt,
        });

        break;
      }
      case 'subscription_updated': {
        const subscription = await db.getSubscriptionByPaddleId(
          paddleSubscriptionId,
        );
        if (!subscription) {
          throw new Error(
            `Subscription not found: Paddle ID. ${paddleSubscriptionId}`,
          );
        }

        switch (status) {
          case 'past_due': {
            await db.subscriptionPastDue(subscription._id);
            break;
          }
          case 'active': {
            const {
              subscription_plan_id: paddleSubscriptionPlanId,
              checkout_id: checkoutId,
              update_url: updateURL,
              cancel_url: cancelURL,
              next_bill_date: nextBillDateAt,
            } = ctx.body;

            const plan = await db.getPlanIdByPaddleId(paddleSubscriptionPlanId);
            if (!plan) {
              throw new Error(
                `Plan not found: Paddle ID. ${paddleSubscriptionPlanId}`,
              );
            }

            await db.subscriptionUpdated(subscription._id, {
              _plan: plan._id,
              _paddlePlanId: paddleSubscriptionPlanId,
              _paddleCheckoutId: checkoutId,
              updateURL,
              cancelURL,
              nextBillDateAt,
            });
            break;
          }
        }
        break;
      }
      case 'subscription_cancelled': {
        await db.cancelSubscription(paddleSubscriptionId);
        break;
      }
      case 'subscription_payment_succeeded': {
        const {
          subscription_plan_id: paddleSubscriptionPlanId,
          order_id: orderId,
          checkout_id: checkoutId,
          user_id: userId,
          quantity,
          unit_price: unitPrice,
          sale_gross: saleGross,
          fee,
          earnings,
          payment_tax: tax,
          payment_method: paymentMethod,
          coupon,
          receipt_url: receiptUrl,
          customer_name: customerName,
          country: customerCountry,
          currency,
          next_bill_date: nextBillDateAt,
        } = ctx.body;

        const subscription = await db.getSubscriptionByPaddleId(
          paddleSubscriptionId,
        );
        if (!subscription) {
          throw new Error(
            `Subscription not found: Paddle ID. ${paddleSubscriptionId}`,
          );
        }
        const plan = await db.getPlanIdByPaddleId(paddleSubscriptionPlanId);
        if (!plan) {
          throw new Error(
            `Plan not found: Paddle ID. ${paddleSubscriptionPlanId}`,
          );
        }

        await db.receivedSubscriptionPayment({
          _user: user._id,
          _subscription: subscription._id,
          _plan: plan._id,
          _paddlePlanId: paddleSubscriptionPlanId,
          _paddleOrderId: orderId,
          _paddleCheckoutId: checkoutId,
          _paddleUserId: userId,
          quantity,
          unitPrice,
          saleGross,
          fee,
          earnings,
          tax,
          paymentMethod,
          coupon,
          customerName,
          customerCountry,
          currency,
          receiptUrl,
          nextBillDateAt,
        });

        break;
      }
      case 'subscription_payment_refunded': {
        const {
          order_id: orderId,
          amount: amountRefund,
          gross_refund: saleGrossRefund,
          tax_refund: taxRefund,
          fee_refund: feeRefund,
        } = ctx.body;

        await db.SubscriptionPaymentRefunded(orderId, {
          amountRefund,
          saleGrossRefund,
          feeRefund,
          taxRefund,
        });
        break;
      }
    }
  });

  server.use(router.routes());

  setupAuthMiddleware({ config, db, server, log });
  setupGraphQLEndpoint({ config, db, server, log });

  server.listen(config.PORT, err => {
    if (err) {
      throw err;
    }
  });
};

init().catch(err => {
  log.error(err);
  process.exit(-1);
});
