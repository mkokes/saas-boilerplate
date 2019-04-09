const moment = require('moment');

module.exports = ({ log: parentLog, db, eventQueue, Sentry }) => {
  const log = parentLog.create('handleUsersSubscription');

  return async () => {
    eventQueue.add(
      async () => {
        try {
          const subscriptions = await db.getActiveSubscriptionsWithNoPaymentMethod();

          subscriptions.forEach(async subscription => {
            const { accessUntil } = subscription;

            const isAccessExpired = moment().isSameOrAfter(
              moment(accessUntil).startOf('day'),
            );

            if (isAccessExpired) {
              await db.cancelSubscription(subscription._id);
            }
          });
        } catch (e) {
          log.error(e.message);
          Sentry.captureException(e);
        }
      },
      { name: 'handleUsersSubscription' },
    );
  };
};
