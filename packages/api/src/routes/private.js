const Router = require('koa-router');

const {
  HANDLE_USERS_TRIAL,
  HANDLE_USERS_SUBSCRIPTION,
} = require('../constants/events');

module.exports = async ({ config: { API_SECRET_KEY }, log: parentLog, db }) => {
  const log = parentLog.create('routes/private');

  const router = new Router();
  router.prefix('/private');

  const authMiddleware = async (ctx, next) => {
    const { key } = ctx.request.body;

    if (key !== API_SECRET_KEY) {
      log.error(`invalid private API key used: ${key}`);
      ctx.throw(401, 'Authentication Error');
    }

    return next();
  };

  router.post('/processor/run-task', authMiddleware, ctx => {
    const { type } = ctx.request.body;

    /* eslint-disable-next-line default-case */
    switch (type) {
      case HANDLE_USERS_TRIAL:
        db.emit(HANDLE_USERS_TRIAL);
        break;
      case HANDLE_USERS_SUBSCRIPTION:
        db.emit(HANDLE_USERS_SUBSCRIPTION);
        break;
    }
  });

  return router;
};
