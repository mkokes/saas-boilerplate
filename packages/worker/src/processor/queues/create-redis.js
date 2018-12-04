const Redis = require('ioredis');

const config =
  process.env.NODE_ENV === 'production'
    ? {
        port: process.env.COMPOSE_REDIS_PORT,
        host: process.env.COMPOSE_REDIS_URL,
        password: process.env.COMPOSE_REDIS_PASSWORD,
      }
    : undefined; // Use the local instance of Redis in development by not passing any connection string

const createRedis = extraConfig => {
  try {
    return new Redis({
      showFriendlyErrorStack: true,
      ...config,
      ...extraConfig,
    });
  } catch (e) {
    throw e;
  }
};

module.exports = createRedis;
