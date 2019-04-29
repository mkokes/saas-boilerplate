const envalid = require('envalid');

const { str, num, bool } = envalid;

const env = envalid.cleanEnv(
  process.env,
  {
    PORT: num({ default: 3001 }),
    HOST: str({ default: '0.0.0.0' }),
    NODE_ENV: str({ default: 'development' }),
    APP_MODE: str({ default: 'dev' }),
    SERVER_NAME: str({ default: 'API' }),
    MAINTENANCE: bool({ default: false }),
    MONGO_URL: str({
      default: '',
    }),
    JWT_SECRET: str({
      default: '',
    }),
    RECAPTCHA_SECRET_KEY: str({
      default: '',
    }),
    PRODUCT_NAME: str({ default: 'DCABot' }),
    PRODUCT_FOUNDER_NAME: str({ default: 'Alfon' }),
    PRODUCT_APP_URL: str({ default: '' }),
    TRIAL_PERIOD_DAYS: num({ default: 7 }),
    COMPANY_NAME: str({ default: 'AMGA Ventures Inc.' }),
    PAPERTRAILAPP_HOST: str({ default: '' }),
    PAPERTRAILAPP_PORT: num({ default: null }),
    API_SECRET_KEY: str({ default: '' }),
    SENTRY_DSN: str({
      default: '',
    }),
    GOOGLE_AUTHENTICATOR_DISPLAY_NAME: str({ default: 'PRODUCT_NAME' }),
    PADDLE_VENDOR_ID: str({ default: '' }),
    PADDLE_VENDOR_AUTH_CODE: str({ default: '' }),
    MIXPANEL_API_KEY: str({ default: '' }),
    MAILCHIMP_API_KEY: str({ default: '' }),
    MAILCHIMP_LIST_ID: str({ default: 'a346d80d6e' }),
    POSTMARK_API_TOKEN: str({ default: '' }),
    POSTMARK_SENDER_EMAIL: str({ default: 'support@amgaventures.com' }),
    COINBASE_COMMERCE_API_SECRET: str({ default: '' }),
    COINBASE_COMMERCE_WEBHOOK_SHARED_SECRET: str({ default: '' }),
    SUPPORT_EMAIL: str({ default: 'support@amgaventures.com' }),
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
