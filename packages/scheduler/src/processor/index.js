const DemoTask = require('./tasks/demoTask');
const CronDemoTask = require('./tasks/cronDemoTask');

module.exports = async ({ config, log: parentLog, scheduler, Sentry }) => {
  const log = parentLog.create('processor');

  const demoTask = DemoTask({
    config,
    log,
    Sentry,
  });

  const cronDemoTask = CronDemoTask({
    config,
    log,
    Sentry,
  });

  scheduler.schedule('demoTask', 60, demoTask);
  scheduler.scheduleCronJob('cronDemoTask', '*/5 * * * *', cronDemoTask);
};
