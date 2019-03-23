const cronJobScheduler = require('node-schedule');
const APIRequestTask = require('./tasks/apiRequest');

module.exports = async ({ config, log: parentLog, Sentry }) => {
  const log = parentLog.create('processor');

  const apiRequestTask = APIRequestTask({
    config,
    log,
    Sentry,
  });

  cronJobScheduler.scheduleJob('* * * * *', () =>
    apiRequestTask('post', '/cron/handle-users-trial'),
  );
};
