const Redis = require('ioredis');

let config; // Use the local instance of Redis in development by not passing any connection string
if (process.env.NODE_ENV === 'production') {
  config = {
    port: process.env.COMPOSE_REDIS_PORT,
    host: process.env.COMPOSE_REDIS_URL,
    password: process.env.COMPOSE_REDIS_PASSWORD,
  };
}

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
