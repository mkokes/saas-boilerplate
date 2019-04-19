const {
  NOTIFICATION,
  HANDLE_USERS_TRIAL,
  HANDLE_USERS_SUBSCRIPTION,
  MANAGE_MAILCHIMP_LIST,
  MIXPANEL_EVENT,
  PADDLE,
  CHARTMOGUL,
} = require('../constants/events');

const SendNotificationEmail = require('./tasks/sendNotificationEmail');
const HandleUsersTrial = require('./tasks/handleUsersTrial');
const HandleUsersSubscription = require('./tasks/handleUsersSubscription');
const ManageMailchimpList = require('./tasks/manageMailchimpList');
const SendMixpanelEvent = require('./tasks/sendMixpanelEvent');
const Paddle = require('./tasks/paddle');
const Chartmogul = require('./tasks/chartmogul');

module.exports = async ({ config, log: parentLog, db, eventQueue, Sentry }) => {
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
  const handleUsersSubscription = HandleUsersSubscription({
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
    Sentry,
  });
  const sendMixpanelEvent = SendMixpanelEvent({
    config,
    log,
    eventQueue,
    Sentry,
  });
  const paddle = Paddle({
    log,
    eventQueue,
    db,
    Sentry,
  });
  const chartmogul = Chartmogul({
    config,
    log,
    eventQueue,
    db,
    Sentry,
  });

  // listen for events
  db.on(NOTIFICATION, sendNotificationEmail);
  db.on(HANDLE_USERS_TRIAL, handleUsersTrial);
  db.on(HANDLE_USERS_SUBSCRIPTION, handleUsersSubscription);
  db.on(MANAGE_MAILCHIMP_LIST, manageMailchimpList);
  db.on(MIXPANEL_EVENT, sendMixpanelEvent);
  db.on(PADDLE, paddle);
  db.on(CHARTMOGUL, chartmogul);
};
