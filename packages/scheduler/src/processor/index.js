const cronJobScheduler = require('node-schedule');
const ApiRunTask = require('./tasks/apiRunTask');

module.exports = async ({ config, log: parentLog, Sentry }) => {
  const log = parentLog.create('processor');

  const apiRunTask = ApiRunTask({
    config,
    log,
    Sentry,
  });

  cronJobScheduler.scheduleJob('* * * * *', () =>
    apiRunTask('handle_users_trial'),
  );
  cronJobScheduler.scheduleJob('* * * * *', () =>
    apiRunTask('handle_users_subscription'),
  );
};
