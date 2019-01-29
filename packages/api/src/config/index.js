const envalid = require('envalid');

const { str, num } = envalid;

const env = envalid.cleanEnv(
  process.env,
  {
    PORT: num({ default: 3001 }),
    NODE_ENV: str({ default: 'development' }),
    APP_MODE: str({ default: 'dev' }),
    GOOGLE_AUTHENTICATOR_DISPLAY_NAME: str({ default: 'BRAND_NAME' }),
    LOG: str({ default: 'debug' }),
    LOGDNA_API_KEY: str({ default: '' }),
    PADDLE_VENDOR_ID: str({ default: '' }),
    PADDLE_VENDOR_AUTH_CODE: str({ default: '' }),
    FRESHDESK_SECRET: str({ default: '' }),
    FRESHDESK_BASE_URL: str({ default: '' }),
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
