const envalid = require('envalid');

const { str, num } = envalid;

const env = envalid.cleanEnv(
  process.env,
  {
    PORT: num({ default: 3003 }),
    HOST: str({ default: '0.0.0.0' }),
    NODE_ENV: str({ default: 'development' }),
    APP_MODE: str({ default: 'dev' }),
    LOG: str({ default: 'debug' }),
    API_SECRET_KEY: str({ default: 'foo' }),
    API_URL: str({ default: '' }),
    LOGDNA_API_KEY: str({ default: '' }),
    SENTRY_DSN: str({
      default: 'https://614c2c61a38141c584a4cc4e19a96f46@sentry.io/1385946',
    }),
    SERVER_NAME: str({ default: 'Scheduler' }),
  },
  {
    dotEnvPath: '.env',
  },
);

// eslint-disable-next-line import/no-dynamic-require
const modeConfig = require(`./${env.APP_MODE}`);

module.exports = Object.freeze({
  ...env,
  ...modeConfig,
});
