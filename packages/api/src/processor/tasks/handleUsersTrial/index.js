const moment = require('moment');

module.exports = ({ log: parentLog, db, eventQueue, Sentry }) => {
  const log = parentLog.create('handleUsersTrials');

  return async () => {
    eventQueue.add(
      async () => {
        try {
          const trialSubscriptions = await db.getUsersInTrialPeriod();

          trialSubscriptions.forEach(async trialSubscription => {
            const { _user, servicePeriodEnd } = trialSubscription;

            const isTrialExpired = moment().isSameOrAfter(
              moment(servicePeriodEnd).startOf('day'),
            );
            const daysLeftUntilTrialExpiration = moment(servicePeriodEnd).diff(
              moment(),
              'days',
            );

            if (isTrialExpired === true) {
              await db.userTrialExpired(_user);
              log.info(`trial expired for user id ${_user}`);
            } else if (daysLeftUntilTrialExpiration === 2) {
              if (!db.isUserTrialExpiringWarningSent(_user)) {
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
