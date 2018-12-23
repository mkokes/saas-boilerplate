const Koa = require('koa');
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
  log.info(`app mode: ${config.APP_MODE}`);

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

  router.get('/paddle-webhooks', async ctx => {
    const { body: paddleEvent } = ctx;
    const {
      p_signature: paddleSignature,
      alert_name: eventName,
      passthrough: userData,
      status,
    } = paddleEvent;
    const user = JSON.parse(userData);

    /*
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
    } */

    /* eslint-disable default-case */
    switch (eventName) {
      case 'subscription_created': {
        const {
          subscription_plan_id: subscriptionPlanId,
          subscription_id: subscriptionId,
          checkout_id: checkoutId,
          quantity,
          unit_price: unitPrice,
          currency,
          update_url: updateURL,
          cancel_url: cancelURL,
          next_bill_date: nextBillDateAt,
        } = paddleEvent;

        const plan = await db.getPlanIdByPaddleId(subscriptionPlanId);
        await db.subscriptionCreated({
          _plan: plan._id,
          _user: user._id,
          _paddleSubscriptionId: subscriptionId,
          _paddleCheckoutId: checkoutId,
          status,
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
        switch (paddleEvent.status) {
          case 'past_due': {
            // Suspend the customer's license whenever their subscription is past due.
            break;
          }
          case 'active': {
            // Handle upgrade and downgrade subscription
            break;
          }
        }
        break;
      }
      case 'subscription_cancelled': {
        // Revoke the customer's license whenever they cancel their subscription.
        break;
      }
      case 'subscription_payment_succeeded': {
        break;
      }
    }
  });

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
