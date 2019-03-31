// const moment = require('moment');

module.exports = ({ log: parentLog, db, eventQueue, Sentry }) => {
  const log = parentLog.create('handleUsersSubscription');

  return async () => {
    eventQueue.add(
      async () => {
        try {
          const subscriptions = await db.getActiveSubscriptionsWithNoPaymentAndExpiredAccess();

          subscriptions.forEach(async subscription => {
            await db.cancelSubscription(subscription._id);
          });
        } catch (e) {
          log.error(e);
          Sentry.captureException(e);
        }
      },
      { name: 'handleUsersSubscription' },
    );
  };
};
