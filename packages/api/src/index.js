const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const Router = require('koa-router');
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

  router.post('/paddle-webhooks', async ctx => {
    console.log(JSON.stringify(ctx));
    const { body: paddleEvent } = ctx;

    const {
      p_signature: paddleSignature,
      alert_name: eventName,
      status,
      subscription_id: paddleSubscriptionId,
      passthrough: userData,
    } = paddleEvent;
    const user = JSON.parse(userData);

    try {
      const serialize = Serialize.serialize(
        Object.keys(paddleSignature)
          .sort()
          // eslint-disable-next-line
          .reduce((r, k) => ((r[k] = paddleSignature[k]), r), {}),
      );
      const verify = crypto.createVerify('RSA-SHA1');
      verify.write(serialize);
      verify.end();

      const PADDLE_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
      3jiasSIDJojosda/asjdnFJSUHISABIiansfisauIUSH93hjiuJSNFiuhn3akmsf
      8F/pZDYQDZeS/LZvWnorXTb7uamCsNuYOgh0/bmBDYOAIkoYvUrSadWHcBQj1hDy
      BTScQKi/yY5J3aEv9syDgZcfxMdsjewiDJdhfIWnsnj4o0mRlNNQTb4QMWzShSSR
      DrmoD5qelV/CJCZH9wmYy3oOpAZffFVTK+g+ouqVyBKViVH5Zum+opvx9Jz85XXN
      IMVD+nkOUJTgC+MLftEF+8J6u7h8LBHaMyFzaY+O2gWhyPn7rkg5GJvXFmTpuXFc
      6DZCxyzDwKG7YliJmgwcFRJaFJ6EPeeG+qUTsHoSVIikI0w2yunVFoFWCxKASVJM
      6mYTM0Vtrhb/96mXY5jJQ4d3Zp3VL/o6SxDPkIo+bWAh4kt66/BPvUFY5bxItLmE
      M6Z6ulQwNdAIz2TuIgj0efxGIzkXAvpzYYD/kUB789ObkDmfMKp/APW5vZT1UhqL
      yV9xtIn7gIwAZxcQP6IxxvrZeZMAlF6vJpJkf1qyZgwlJmpWtJdXArA4gIU7VXe4
      sYmVatElS/gM/V+83uDHisokqnc382uJshud802801jKNsshuhu9u09iJSDNuwjs
      moil4WBGxur9OPADy8JGcOl4OdTETMoMMR1157iD8bTep6ZGD268ijPfpL6Kt7hB
      rxovOHTh9+jrBNnnsIhbFp8CAwEAAQ==
      -----END PUBLIC KEY-----`;

      if (!verify.verify(PADDLE_PUBLIC_KEY, paddleSignature, 'base64')) {
        throw new Error('INVALID_PADDLE_SIGNATURE');
      }
    } catch (e) {
      ctx.throw(403, e.message);
    }

    /* eslint-disable default-case */
    switch (eventName) {
      case 'subscription_created': {
        const {
          subscription_plan_id: paddleSubscriptionPlanId,
          checkout_id: checkoutId,
          currency,
          update_url: updateURL,
          cancel_url: cancelURL,
          next_bill_date: nextBillDateAt,
        } = paddleEvent;

        const plan = await db.getPlanIdByPaddleId(paddleSubscriptionPlanId);
        if (!plan) {
          throw new Error(
            `Plan not found: Paddle ID. ${paddleSubscriptionPlanId}`,
          );
        }

        await db.createSubscription({
          _plan: plan._id,
          _user: user._id,
          _paddlePlanId: paddleSubscriptionPlanId,
          _paddleCheckoutId: checkoutId,
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
            } = paddleEvent;

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
        } = paddleEvent;

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
        } = paddleEvent;

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

  server.use(bodyParser());
  server.use(router.routes());
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
