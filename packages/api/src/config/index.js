const envalid = require('envalid');

const { str, num, json } = envalid;

const env = envalid.cleanEnv(
  process.env,
  {
    PORT: num({ default: 3001 }),
    NODE_ENV: str({ default: 'development' }),
    APP_MODE: str({ default: 'dev' }),
    SERVER_NAME: str({ default: 'API' }),
    LOG: str({ default: 'debug' }),
    API_SECRET_KEY: str({ default: 'foo' }),
    LOGDNA_API_KEY: str({ default: '' }),
    SENTRY_DSN: str({
      default: 'https://614c2c61a38141c584a4cc4e19a96f46@sentry.io/1385946',
    }),
    GOOGLE_AUTHENTICATOR_DISPLAY_NAME: str({ default: 'BRAND_NAME' }),
    PADDLE_VENDOR_ID: str({ default: '' }),
    PADDLE_VENDOR_AUTH_CODE: str({ default: '' }),
    FRESHDESK_SECRET: str({ default: '' }),
    FRESHDESK_BASE_URL: str({ default: '' }),
    MIXPANEL_TOKEN: str({ default: '10d9e1131949749220397c144c4c6826' }),
    POSTMARK_API_TOKEN: str({ default: '' }),
    POSTMARK_SENDER_EMAIL: str({ default: 'payments@amgaventures.com' }),
    POSTMARK_TEMPLATES_ID: json({
      VERIFY_EMAIL: 123,
      WELCOME: 123,
      FORGOT_PASSWORD: 123,
      PASSWORD_RESETED: 123,
      PASSWORD_CHANGED: 123,
      EMAIL_CHANGED: 123,
    }),
    POSTMARK_TEMPLATE_VALUES: json({
      product_name: 'DCABot',
      product_url: 'https://dcabot.io',
      support_url: 'https://support.dcabot.io',
      company_name: 'AMGA Ventures Inc.',
      company_address: null,
    }),
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
