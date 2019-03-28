const ApiRunTask = require('./tasks/apiRunTask');

const {
  HANDLE_USERS_TRIAL,
  HANDLE_USERS_SUBSCRIPTION,
} = require('../constants/tasks');

module.exports = async ({ config, log: parentLog, scheduler, Sentry }) => {
  const log = parentLog.create('processor');

  const apiRunTask = ApiRunTask({
    config,
    log,
    Sentry,
  });

  scheduler.schedule(HANDLE_USERS_TRIAL, 60, () =>
    apiRunTask(HANDLE_USERS_TRIAL),
  );
  scheduler.schedule(HANDLE_USERS_SUBSCRIPTION, 60, () =>
    apiRunTask(HANDLE_USERS_SUBSCRIPTION),
  );
};
