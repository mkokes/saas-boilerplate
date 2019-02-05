const postmark = require('postmark');

const {
  VERIFY_EMAIL,
  WELCOME,
  FORGOT_PASSWORD,
  PASSWORD_RESETED,
  PASSWORD_CHANGED,
  EMAIL_CHANGED,
} = require('../../../constants/notifications');

module.exports = ({ config, log: parentLog, Sentry }) => {
  const log = parentLog.create('sendNotificationEmail');

  return async notification => {
    try {
      const client = new postmark.ServerClient(config.POSTMARK_API_TOKEN);

      const templateId = config.POSTMARK_TEMPLATES_ID;
      let templateModel = {
        ...config.POSTMARK_TEMPLATE_VALUES,
      };

      /* eslint-disable default-case */
      switch (notification.type) {
        case VERIFY_EMAIL:
          templateModel = {};
          break;
        case WELCOME:
          templateModel = {};
          break;
        case FORGOT_PASSWORD:
          templateModel = {};
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
      }

      await client.sendEmailWithTemplate({
        TemplateId: templateId,
        From: config.POSTMARK_SENDER_EMAIL,
        To: notification.data.email,
        TemplateModel: templateModel,
        Metadata: {
          notification_id: notification._id,
          user_id: notification._user,
        },
        TrackOpens: true,
        TrackLinks: 'TextOnly',
      });
    } catch (err) {
      log.error(err.message);
      Sentry.captureException(new Error(err.message));
    }
  };
};
