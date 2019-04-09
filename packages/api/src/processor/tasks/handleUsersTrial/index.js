const moment = require('moment');

module.exports = ({ log: parentLog, db, eventQueue, Sentry }) => {
  const log = parentLog.create('handleUsersTrials');

  return async () => {
    eventQueue.add(
      async () => {
        try {
          const usersInTrialPeriod = await db.getUsersInTrialPeriod();

          usersInTrialPeriod.forEach(async user => {
            const { trialPeriodEndsAt, trialExpiringNotified } = user;

            const isTrialExpired = moment().isSameOrAfter(
              moment(trialPeriodEndsAt).startOf('day'),
            );
            const daysLeftUntilTrialExpiration = moment(trialPeriodEndsAt).diff(
              moment(),
              'days',
            );

            if (isTrialExpired === true) {
              await db.userTrialExpired(user._id);
              log.info(`trial expired for user id ${user._id}`);
            } else if (
              !trialExpiringNotified &&
              daysLeftUntilTrialExpiration === 2
            ) {
              // send trial expiring notification when 3 days left until expiration
              await db.userTrialExpiringWarning(user._id);
              log.info(`trial warning sent for user id ${user._id}`);
            }
          });
        } catch (e) {
          log.error(e.message);
          Sentry.captureException(e);
        }
      },
      { name: 'handleUsersTrials' },
    );
  };
};
