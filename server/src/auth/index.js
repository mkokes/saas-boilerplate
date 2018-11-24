const jwt = require('koa-jwt');

const { assertAccessTokenPayload } = require('../utils/asserts');

module.exports = ({ config: { JWT_SECRET }, server, db, log: parentLog }) => {
  const log = parentLog.create('auth');

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
        const decodedPayload = ctx.state.user;
        assertAccessTokenPayload(decodedPayload);

        const userId = decodedPayload._id;
        const tokenPasswordHash = decodedPayload.password;

        const challengeStatus = await db.loginChallenge(
          userId,
          tokenPasswordHash,
        );

        if (!challengeStatus) {
          ctx.state.user = '';
        }
      } catch (err) {
        log.debug(err);
        ctx.state.user = '';
      }
    }

    await next();
  });
};
