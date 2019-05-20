const jwt = require('koa-jwt');

const { assertAccessTokenPayload } = require('../utils/asserts');

module.exports = ({ config: { JWT_SECRET }, app, db }) => {
  app.use(
    jwt({
      secret: JWT_SECRET,
      passthrough: true,
      algorithm: 'HS256',
    }),
  );

  app.use(async (ctx, next) => {
    // if we successfully decoded a JWT
    if (ctx.state.user) {
      try {
        const decodedJWT = ctx.state.user;
        assertAccessTokenPayload(decodedJWT);

        await db.authChallenge(decodedJWT._id, decodedJWT.iat);
      } catch (err) {
        ctx.state.user = '';
      }
    }

    await next();
  });
};
