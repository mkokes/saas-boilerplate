const moment = require('moment');

module.exports = ({ log: parentLog, db, Sentry }) => {
  const log = parentLog.create('handleUsersTrials');

  return async () => {
    try {
      const usersInTrialPeriod = await db.getUsersInTrialPeriod();

      usersInTrialPeriod.forEach(async user => {
        const { trialPeriodEndsAt, trialExpiringNotified } = user;

        const isTrialExpired = moment(trialPeriodEndsAt).isAfter(Date.now());
        const daysLeftUntilTrialExpiration = moment(Date.now()).diff(
          trialPeriodEndsAt,
          'days',
        );

        if (isTrialExpired === true) {
          db.userTrialExpired(user._id);
        } else if (
          !trialExpiringNotified &&
          daysLeftUntilTrialExpiration === 3
        ) {
          db.userTrialExpiringWarning(user._id);
        }
      });
    } catch (err) {
      log.error(err.message);
      Sentry.captureException(new Error(err.message));
    }
  };
};
