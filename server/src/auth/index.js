const jwt = require('koa-jwt');

module.exports = ({ config: { JWT_SECRET }, server, log: parentLog }) => {
  const log = parentLog.create('auth');

  server.use(
    jwt({
      secret: JWT_SECRET,
      passthrough: true,
      algorithm: 'HS256',
    }),
  );

  server.use(async (ctx, next) => {
    try {
      const { _id } = ctx.state; // got user id
    } catch (e) {
      log.debug(e);
    }

    await next();
  });
};
