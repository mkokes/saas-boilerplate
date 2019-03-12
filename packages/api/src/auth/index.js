const jwt = require('koa-jwt');

const { assertAccessTokenPayload } = require('../utils/asserts');

module.exports = ({ config: { JWT_SECRET }, server, db }) => {
  server.use(
    jwt({
      secret: JWT_SECRET,
      passthrough: true,
      algorithm: 'HS256',
    }),
  );

  server.use(async (ctx, next) => {
    // if we successfully decoded a JWT
    if (ctx.state.user) {
      try {
        const decodedJWT = ctx.state.user;
        assertAccessTokenPayload(decodedJWT);

        const challengeStatus = await db.authChallenge(
          decodedJWT._id,
          decodedJWT.iat,
        );
        if (!challengeStatus) {
          throw new Error('User did not pass auth challenge');
        }
      } catch (err) {
        ctx.state.user = '';
      }
    }

    await next();
  });
};
