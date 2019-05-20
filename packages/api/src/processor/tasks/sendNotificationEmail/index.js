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
  SUPPORT_REQUEST_USER_CONFIRMATION,
  SUBSCRIPTION_STARTED,
  SUBSCRIPTION_ENDED,
  SUBSCRIPTION_RENEWAL_CANCELLED,
  PAYMENT_RECEIVED,
  SEND_FEEDBACK,
} = require('../../../constants/notifications');

module.exports = ({
  config: {
    PRODUCT_NAME,
    PRODUCT_FOUNDER_NAME,
    PRODUCT_APP_URL,
    COMPANY_NAME,
    POSTMARK_API_TOKEN,
    POSTMARK_SENDER_EMAIL,
    SUPPORT_EMAIL,
  },
  log: parentLog,
  eventQueue,
  db,
  Sentry,
}) => {
  const log = parentLog.create('sendNotificationEmail');

  const POSTMARK_TEMPLATE_ALIASES = {
    VERIFY_EMAIL: 'email-verification',
    WELCOME: 'welcome',
    FORGOT_PASSWORD: 'forgot-password',
    PASSWORD_RESETED: 'password-changed',
    PASSWORD_CHANGED: 'password-changed',
    EMAIL_CHANGED: 'email-changed',
    TRIAL_EXPIRING: 'trial-expiring',
    TRIAL_EXPIRED: 'trial-expired',
    ENABLED_2FA: 'enabled-2fa',
    DISABLED_2FA: 'disabled-2fa',
    SUPPORT_REQUEST: 'support-request',
    SUPPORT_REQUEST_USER_CONFIRMATION: 'support-request-user-confirmation',
    SUBSCRIPTION_STARTED: 'subscription-started',
    SUBSCRIPTION_ENDED: 'subscription-ended',
    SUBSCRIPTION_RENEWAL_CANCELLED: 'subscription-renewal-cancelled',
    PAYMENT_RECEIVED: 'payment-received',
    SEND_FEEDBACK: 'send-feedback',
  };

  const POSTMARK_TEMPLATE_VALUES = {
    product_founder_name: PRODUCT_FOUNDER_NAME,
    product_name: PRODUCT_NAME,
    product_url: PRODUCT_APP_URL,
    support_url: `${PRODUCT_APP_URL}/support`,
    company_name: COMPANY_NAME,
    company_address: null,
  };

  return async notification => {
    eventQueue.add(
      async () => {
        try {
          await notification
            .populate(
              '_user',
              'email firstName timezone trialDaysLength signupAt',
            )
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

              targetEmail =
                safeGet(notification.variables, 'candidateEmail') ||
                targetEmail;
              break;
            case WELCOME: {
              templateModel.action_url = `${PRODUCT_APP_URL}/dashboard`;
              templateModel.login_url = `${PRODUCT_APP_URL}/auth/login`;
              templateModel.name = _user.firstName;
              templateModel.email = _user.email;

              const subscription = await db.getUserSubscription(_user._id);
              const { startedAt, servicePeriodEndAt } = subscription;

              templateModel.trial_length =
                moment(servicePeriodEndAt).diff(startedAt, 'days') + 1;
              templateModel.trial_start_date = moment(startedAt).format('LL');
              templateModel.trial_end_date = moment(servicePeriodEndAt).format(
                'LL',
              );
              break;
            }
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
            case SUPPORT_REQUEST_USER_CONFIRMATION:
              if (!targetEmail) {
                targetEmail = templateModel.requester_email;
              }
              targetReplyTo = SUPPORT_EMAIL;

              break;
            case SUBSCRIPTION_ENDED:
              break;
            case SUBSCRIPTION_STARTED:
              break;
            case SUBSCRIPTION_RENEWAL_CANCELLED:
              break;
            case PAYMENT_RECEIVED:
              templateModel._shortId = notification.variables._shortId;
              templateModel.saleGross = notification.variables.saleGross;
              templateModel.paymentMethod =
                notification.variables.paymentMethod;
              templateModel.description = notification.variables.description;
              break;
            case SEND_FEEDBACK:
              targetEmail = SUPPORT_EMAIL;
              targetReplyTo = templateModel.feedback_sender_email;
              break;
          }

          /* eslint-disable-next-line no-param-reassign */
          notification.variables = templateModel;
          await notification.save();

          await postmarkClient.sendEmailWithTemplate({
            TemplateAlias: POSTMARK_TEMPLATE_ALIASES[notification.type],
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

          /* eslint-disable no-param-reassign  */
          notification.sent = true;
          notification.sentAt = Date.now();
          /* eslint-enable no-param-reassign  */
          await notification.save();
        } catch (e) {
          log.error(e.message);

          Sentry.configureScope(scope => {
            scope.setExtra('notification', notification);
          });
          Sentry.captureException(e);
        }
      },
      { name: 'sendNotificationEmail' },
    );
  };
};
