const {
  NOTIFICATION,
  HANDLE_USERS_TRIAL,
  MANAGE_MAILCHIMP_LIST,
} = require('../constants/events');
const SendNotificationEmail = require('./tasks/sendNotificationEmail');
const HandleUsersTrial = require('./tasks/handleUsersTrial');
const ManageMailchimpList = require('./tasks/manageMailchimpList');

module.exports = async ({
  config,
  log: parentLog,
  db,
  eventQueue,
  mailchimp,
  Sentry,
}) => {
  const log = parentLog.create('processor');

  const sendNotificationEmail = SendNotificationEmail({
    config,
    log,
    db,
    eventQueue,
    Sentry,
  });
  const handleUsersTrial = HandleUsersTrial({
    config,
    log,
    db,
    eventQueue,
    Sentry,
  });
  const manageMailchimpList = ManageMailchimpList({
    config,
    log,
    eventQueue,
    mailchimp,
    Sentry,
  });

  // listen for events
  db.on(NOTIFICATION, sendNotificationEmail);
  db.on(HANDLE_USERS_TRIAL, handleUsersTrial);
  db.on(MANAGE_MAILCHIMP_LIST, manageMailchimpList);
};
