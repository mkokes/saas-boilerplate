const Router = require('koa-router');

const { HANDLE_USERS_TRIAL } = require('../../constants/events');

module.exports = async ({ config: { API_SECRET_KEY }, log: parentLog, db }) => {
  const log = parentLog.create('api/private');

  const router = new Router();
  router.prefix('/api/private');

  const authMiddleware = async (ctx, next) => {
    const { key } = ctx.request.body;

    if (key !== API_SECRET_KEY) {
      log.error(`Invalid private API key used: ${key}`);
      ctx.throw(401, 'Authentication Error');
    }

    return next();
  };

  router.post('/cron/handle-users-trial', authMiddleware, () =>
    db.emit(HANDLE_USERS_TRIAL),
  );

  return router;
};
