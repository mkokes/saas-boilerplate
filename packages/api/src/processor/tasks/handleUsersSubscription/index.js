// const moment = require('moment');

module.exports = ({ log: parentLog, db, eventQueue, Sentry }) => {
  const log = parentLog.create('handleUsersSubscription');

  return async () => {
    eventQueue.add(
      async () => {
        try {
          const usersInTrialPeriod = await db.getUsersWithActiveSubscription();

          usersInTrialPeriod.forEach(async user => {
            const { _id } = user;

            console.log(_id);
          });
        } catch (err) {
          log.error(err.message);
          Sentry.captureException(new Error(err.message));
        }
      },
      { name: 'handleUsersSubscription' },
    );
  };
};
