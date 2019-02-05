const DemoTask = require('./tasks/demoTask');
const CronDemoTask = require('./tasks/cronDemoTask');

module.exports = async ({ config, log: parentLog, scheduler, sentry }) => {
  const log = parentLog.create('processor');

  const demoTask = DemoTask({
    config,
    log,
    sentry,
  });

  const cronDemoTask = CronDemoTask({
    config,
    log,
    sentry,
  });

  scheduler.schedule('demoTask', 60, demoTask);
  scheduler.scheduleCronJob('cronDemoTask', '*/5 * * * *', cronDemoTask);
};
