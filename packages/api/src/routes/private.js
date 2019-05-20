const Router = require('koa-joi-router');
const { Joi } = Router;

const {
  HANDLE_USERS_TRIAL,
  HANDLE_USERS_SUBSCRIPTION,
} = require('../constants/events');

module.exports = async ({ config: { API_SECRET_KEY }, log: parentLog, db }) => {
  const log = parentLog.create('routes/private');

  const privateApi = Router();
  privateApi.prefix('/private');

  privateApi.route({
    method: 'post',
    path: '/processor/run-task',
    validate: {
      body: {
        key: Joi.string(),
        type: Joi.string(),
      },
      type: 'json',
      failure: 400,
    },
    pre: (ctx, next) => {
      const { key } = ctx.request.body;

      if (key !== API_SECRET_KEY) {
        log.error(`invalid private API key used: ${key}`);
        ctx.throw(401, 'Authentication Error');
      }

      return next();
    },
    handler: ctx => {
      const { type } = ctx.request.body;

      switch (type) {
        case HANDLE_USERS_TRIAL:
          db.emit(HANDLE_USERS_TRIAL);
          break;
        case HANDLE_USERS_SUBSCRIPTION:
          db.emit(HANDLE_USERS_SUBSCRIPTION);
          break;
        default:
          throw new Error('unhandled event');
      }
    },
  });

  return privateApi;
};
