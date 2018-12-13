const jwt = require('koa-jwt');

const { assertAccessTokenPayload } = require('../utils/asserts');

module.exports = ({ config, server, db, log: parentLog }) => {
  const log = parentLog.create('auth');

  server.use(
    jwt({
      secret: config.JWT_SECRET,
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

        const challengeStatus = await db.loginChallenge(decodedJWT);
        if (!challengeStatus) {
          throw new Error('User did not pass loginChallenge');
        }
      } catch (err) {
        if (config.APP_MODE === 'dev') {
          log.error(err);
        }

        ctx.state.user = '';
      }
    }

    await next();
  });
};
