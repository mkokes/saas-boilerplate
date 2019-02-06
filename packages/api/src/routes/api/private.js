const Router = require('koa-router');

module.exports = async ({ config, db, log: parentLog }) => {
  const log = parentLog.create('api/private');

  const router = new Router();
  router.prefix('/api/private');

  const authMiddleware = async (ctx, next) => {
    const { key } = ctx.request.body;

    if (key !== config.API_SECRET_KEY) {
      log.error(`Invalid private API key used: ${key}`);
      ctx.throw(401, 'Authentication Error');
    }

    return next();
  };

  router.post('/handle-user-trials', authMiddleware, async ctx => {});

  return router;
};
