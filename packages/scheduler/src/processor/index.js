const cronJobScheduler = require('node-schedule');
const HandleUsersTrialTask = require('./tasks/handleUsersTrial');

module.exports = async ({ config, log: parentLog, Sentry }) => {
  const log = parentLog.create('processor');

  const handleUsersTrialTask = HandleUsersTrialTask({
    config,
    log,
    Sentry,
  });

  cronJobScheduler.scheduleJob('* * * * *', handleUsersTrialTask); // run every minute
};
