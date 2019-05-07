const moment = require('moment');

module.exports = ({ log: parentLog, db, eventQueue, Sentry }) => {
  const log = parentLog.create('handleUsersTrials');

  return async () => {
    eventQueue.add(
      async () => {
        try {
          const trialSubscriptions = await db.getUsersInTrialPeriod();

          trialSubscriptions.forEach(async trialSubscription => {
            const { _user, startedAt, servicePeriodEnd } = trialSubscription;

            const isTrialExpired = moment().isSameOrAfter(
              moment(servicePeriodEnd).startOf('day'),
            );
            const daysLeftUntilTrialExpiration =
              moment(servicePeriodEnd).diff(startedAt, 'days') + 1; // add +1 day to count current day

            if (isTrialExpired === true) {
              await db.userTrialExpired(_user);
              log.info(`trial expired for user id ${_user}`);
            } else if (daysLeftUntilTrialExpiration === 3) {
              const isTrialExpiringWarningSent = await db.isUserTrialExpiringWarningSent(
                _user,
              );

              if (!isTrialExpiringWarningSent) {
                await db.sendUserTrialExpiringWarning(_user);
                log.info(`trial warning sent for user id ${_user}`);
              }
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
