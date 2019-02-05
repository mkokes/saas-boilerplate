const { NOTIFICATION } = require('../constants/events');
const SendNotificationEmail = require('./tasks/sendNotificationEmail');

module.exports = async ({ config, log: parentLog, db, Sentry }) => {
  const log = parentLog.create('processor');

  const sendNotificationEmail = SendNotificationEmail({
    config,
    log,
    db,
    Sentry,
  });

  // listen for notifications
  db.on(NOTIFICATION, sendNotificationEmail);
};
