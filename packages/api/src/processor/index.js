const { NOTIFICATION, HANDLE_USER_TRIALS } = require('../constants/events');
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
  db.on(HANDLE_USER_TRIALS, () => console.log('GOT IT! 123'));
};
