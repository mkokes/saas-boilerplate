const postmark = require('postmark');
const moment = require('moment-timezone');

const {
  VERIFY_EMAIL,
  WELCOME,
  FORGOT_PASSWORD,
  PASSWORD_RESETED,
  PASSWORD_CHANGED,
  EMAIL_CHANGED,
  TRIAL_EXPIRING,
  TRIAL_EXPIRED,
} = require('../../../constants/notifications');

module.exports = ({ config, log: parentLog, Sentry }) => {
  const log = parentLog.create('sendNotificationEmail');

  const POSTMARK_TEMPLATES_ID = {
    VERIFY_EMAIL: 10142453,
    WELCOME: 10142454,
    FORGOT_PASSWORD: 10144783,
    PASSWORD_RESETED: 10142452,
    PASSWORD_CHANGED: 10142452,
    EMAIL_CHANGED: 10144785,
    TRIAL_EXPIRING: 10142455,
    TRIAL_EXPIRED: 10141867,
  };

  const POSTMARK_TEMPLATE_VALUES = {
    product_name: 'DCABot',
    product_url: 'https://dcabot.io',
    support_url: 'https://support.dcabot.io',
    company_name: 'AMGA Ventures Inc.',
    company_address: null,
  };

  return async notification => {
    try {
      await notification
        .populate('_user', 'email firstName timezone registeredAt')
        .execPopulate();
      const { _user } = notification;

      const postmarkClient = new postmark.ServerClient(
        config.POSTMARK_API_TOKEN,
      );

      let templateModel = {
        ...POSTMARK_TEMPLATE_VALUES,
        ...notification.variables,
      };

      /* eslint-disable default-case */
      switch (notification.type) {
        case VERIFY_EMAIL:
          templateModel.action_url = notification.variables.action_url;
          templateModel.name = _user.firstName;
          break;
        case WELCOME:
          templateModel.action_url = `${config.PRODUCT_APP_URL}/dashboard`;
          templateModel.login_url = `${config.PRODUCT_APP_URL}/auth/login`;
          templateModel.name = _user.firstName;
          templateModel.email = _user.email;
          templateModel.trial_length = config.PRODUCT_TRIAL_LENGTH;
          templateModel.trial_start_date = moment(
            _user.registeredAt,
            _user.timezone,
          ).format('YYYY-MM-DD');

          /* eslint-disable no-case-declarations */
          const trialEndDate = new Date(_user.registeredAt);
          trialEndDate.setDate(
            trialEndDate.getDate() + config.PRODUCT_TRIAL_LENGTH,
          );
          templateModel.trial_end_date = moment(
            trialEndDate,
            _user.timezone,
          ).format('YYYY-MM-DD');
          break;
        case FORGOT_PASSWORD:
          templateModel.action_url = notification.variables.action_url;
          break;
        case PASSWORD_RESETED:
          templateModel = {};
          break;
        case PASSWORD_CHANGED:
          templateModel = {};
          break;
        case EMAIL_CHANGED:
          templateModel = {};
          break;
        case TRIAL_EXPIRING:
          templateModel = {};
          break;
        case TRIAL_EXPIRED:
          templateModel = {};
          break;
      }

      /* eslint-disable-next-line no-param-reassign */
      notification.variables = templateModel;
      await notification.save();

      await postmarkClient.sendEmailWithTemplate({
        TemplateId: POSTMARK_TEMPLATES_ID[notification.type],
        From: config.POSTMARK_SENDER_EMAIL,
        To: _user.email,
        TemplateModel: templateModel,
        Metadata: {
          notification_id: notification._id,
          user_id: _user._id,
        },
        TrackOpens: true,
        TrackLinks: 'TextOnly',
      });

      /* eslint-disable-next-line no-param-reassign */
      notification.sent = true;
      await notification.save();
    } catch (err) {
      log.error(err.message);
      Sentry.captureException(new Error(err.message));
    }
  };
};
