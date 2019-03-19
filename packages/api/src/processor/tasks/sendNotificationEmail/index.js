const postmark = require('postmark');
const moment = require('moment-timezone');
const safeGet = require('lodash.get');

const {
  VERIFY_EMAIL,
  WELCOME,
  FORGOT_PASSWORD,
  PASSWORD_RESETED,
  PASSWORD_CHANGED,
  EMAIL_CHANGED,
  TRIAL_EXPIRING,
  TRIAL_EXPIRED,
  ENABLED_2FA,
  DISABLED_2FA,
  SUPPORT_REQUEST,
  SUPPORT_REQUEST_CONFIRMATION,
} = require('../../../constants/notifications');

module.exports = ({
  config: {
    PRODUCT_NAME,
    PRODUCT_FOUNDER_NAME,
    PRODUCT_APP_URL,
    PRODUCT_TRIAL_DAYS_LENGTH,
    COMPANY_NAME,
    POSTMARK_API_TOKEN,
    POSTMARK_SENDER_EMAIL,
    SUPPORT_EMAIL,
  },
  log: parentLog,
  Sentry,
}) => {
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
    ENABLED_2FA: 10148059,
    DISABLED_2FA: 10148227,
    SUPPORT_REQUEST: 10737319,
    SUPPORT_REQUEST_CONFIRMATION: 10737781,
  };

  const POSTMARK_TEMPLATE_VALUES = {
    product_founder_name: PRODUCT_FOUNDER_NAME,
    product_name: PRODUCT_NAME,
    product_url: PRODUCT_APP_URL,
    support_url: `${PRODUCT_APP_URL}/contact-support`,
    company_name: COMPANY_NAME,
    company_address: null,
  };

  return async notification => {
    try {
      await notification
        .populate('_user', 'email firstName timezone registeredAt')
        .execPopulate();
      const { _user } = notification;

      const postmarkClient = new postmark.ServerClient(POSTMARK_API_TOKEN);

      const templateModel = {
        ...POSTMARK_TEMPLATE_VALUES,
        ...notification.variables,
      };

      let targetEmail = safeGet(_user, 'email');
      let targetReplyTo = null;
      /* eslint-disable default-case */
      switch (notification.type) {
        case VERIFY_EMAIL:
          templateModel.action_url = notification.variables.action_url;
          templateModel.name = _user.firstName;
          break;
        case WELCOME:
          templateModel.action_url = `${PRODUCT_APP_URL}/dashboard`;
          templateModel.login_url = `${PRODUCT_APP_URL}/auth/login`;
          templateModel.name = _user.firstName;
          templateModel.email = _user.email;
          templateModel.trial_length = PRODUCT_TRIAL_DAYS_LENGTH;
          templateModel.trial_start_date = moment(
            _user.registeredAt,
            _user.timezone,
          ).format('LL');

          /* eslint-disable no-case-declarations */
          const trialEndDate = new Date(_user.registeredAt);
          trialEndDate.setDate(
            trialEndDate.getDate() + PRODUCT_TRIAL_DAYS_LENGTH,
          );
          templateModel.trial_end_date = moment(
            trialEndDate,
            _user.timezone,
          ).format('LL');
          break;
        case FORGOT_PASSWORD:
          templateModel.action_url = notification.variables.action_url;
          templateModel.name = _user.firstName;
          break;
        case PASSWORD_RESETED:
          templateModel.action_url = `${PRODUCT_APP_URL}/auth/reset-password`;
          break;
        case PASSWORD_CHANGED:
          templateModel.action_url = `${PRODUCT_APP_URL}/auth/reset-password`;
          break;
        case EMAIL_CHANGED:
          targetEmail = templateModel.old_email;
          templateModel.name = _user.firstName;
          templateModel.email = _user.email;
          break;
        case TRIAL_EXPIRING:
          break;
        case TRIAL_EXPIRED:
          break;
        case ENABLED_2FA:
          break;
        case DISABLED_2FA:
          break;
        case SUPPORT_REQUEST:
          targetEmail = SUPPORT_EMAIL;
          targetReplyTo = templateModel.requester_email;
          break;
        case SUPPORT_REQUEST_CONFIRMATION:
          if (!targetEmail) {
            targetEmail = templateModel.requester_email;
          }
          targetReplyTo = SUPPORT_EMAIL;

          break;
      }

      /* eslint-disable-next-line no-param-reassign */
      notification.variables = templateModel;
      await notification.save();

      await postmarkClient.sendEmailWithTemplate({
        TemplateId: POSTMARK_TEMPLATES_ID[notification.type],
        From: POSTMARK_SENDER_EMAIL,
        To: targetEmail,
        ReplyTo: targetReplyTo,
        TemplateModel: templateModel,
        Metadata: {
          notification_id: notification._id,
          user_id: safeGet(_user, 'email'),
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
