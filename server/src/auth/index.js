const jwt = require('koa-jwt');

module.exports = ({ log: parentLog, server }) => {
  const log = parentLog.create('auth');

  server.use(
    jwt({
      secret: 'amgaventures',
      passthrough: true,
      algorithm: 'HS256',
    }),
  );

  server.use(async (ctx, next) => {
    if (ctx.state.user) {
      log.debug('got user', ctx.state.user);
      // try {
      // } catch (err) {
      //   ctx.state.user = '';
      // }
    }

    await next();
  });
};
