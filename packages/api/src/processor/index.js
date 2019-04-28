const {
  NOTIFICATION,
  HANDLE_USERS_TRIAL,
  HANDLE_USERS_SUBSCRIPTION,
  MAILCHIMP,
  MIXPANEL_EVENT,
  PADDLE,
  COINBASE_COMMERCE,
} = require('../constants/events');

const SendNotificationEmail = require('./tasks/sendNotificationEmail');
const HandleUsersTrial = require('./tasks/handleUsersTrial');
const HandleUsersSubscription = require('./tasks/handleUsersSubscription');
const Mailchimp = require('./tasks/mailchimp');
const Mixpanel = require('./tasks/mixpanel');
const Paddle = require('./tasks/paddle');
const CoinbaseCommerce = require('./tasks/coinbaseCommerce');

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
  const mailchimp = Mailchimp({
    config,
    log,
    eventQueue,
    Sentry,
  });
  const mixpanel = Mixpanel({
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
  const coinbaseCommerce = CoinbaseCommerce({
    log,
    eventQueue,
    db,
    Sentry,
  });

  // listen for events
  db.on(NOTIFICATION, sendNotificationEmail);
  db.on(HANDLE_USERS_TRIAL, handleUsersTrial);
  db.on(HANDLE_USERS_SUBSCRIPTION, handleUsersSubscription);
  db.on(MAILCHIMP, mailchimp);
  db.on(MIXPANEL_EVENT, mixpanel);
  db.on(PADDLE, paddle);
  db.on(COINBASE_COMMERCE, coinbaseCommerce);
};
