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
    if (ctx.state.user) {
      try {
        // @TODO: Validate user account ...
      } catch (err) {
        log.debug(err);
        ctx.state.user = '';
      }
    }

    await next();
  });
};
