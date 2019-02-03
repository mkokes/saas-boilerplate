const Redis = require('ioredis');

module.exports = ({ config }) => {
  let redisConfig;
  if (config.APP_MODE === 'prod') {
    redisConfig = {
      port: process.env.COMPOSE_REDIS_PORT,
      host: process.env.COMPOSE_REDIS_URL,
      password: process.env.COMPOSE_REDIS_PASSWORD,
    };
  }

  const createRedis = extraConfig => {
    try {
      return new Redis({
        showFriendlyErrorStack: true,
        ...redisConfig,
        ...extraConfig,
      });
    } catch (e) {
      throw e;
    }
  };

  return createRedis;
};
