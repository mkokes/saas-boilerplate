const jwt = require('koa-jwt');

module.exports = ({ config: { JWT_SECRET }, server }) => {
  server.use(
    jwt({
      secret: JWT_SECRET,
      passthrough: true,
      algorithm: 'RS256',
    }),
  );

  server.use(async (ctx, next) => {
    if (ctx.state.user) {
      // try {
      // } catch (err) {
      //   ctx.state.user = '';
      // }
    }

    await next();
  });
};
