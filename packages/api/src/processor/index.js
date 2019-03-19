const { NOTIFICATION, HANDLE_USERS_TRIAL } = require('../constants/events');
const SendNotificationEmail = require('./tasks/sendNotificationEmail');
const HandleUsersTrial = require('./tasks/handleUsersTrial');

module.exports = async ({ config, log: parentLog, db, Sentry }) => {
  const log = parentLog.create('processor');

  const sendNotificationEmail = SendNotificationEmail({
    config,
    log,
    db,
    Sentry,
  });
  const handleUsersTrial = HandleUsersTrial({
    config,
    log,
    db,
    Sentry,
  });

  // listen for events
  db.on(NOTIFICATION, sendNotificationEmail);
  db.on(HANDLE_USERS_TRIAL, handleUsersTrial);
};
