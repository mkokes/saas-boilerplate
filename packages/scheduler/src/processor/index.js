const cronScheduler = require('node-schedule');

const DemoTask = require('./tasks/demoTask');
const CronDemoTask = require('./tasks/cronDemoTask');

module.exports = async ({ config, log: parentLog, scheduler }) => {
  const log = parentLog.create('processor');

  const demoTask = DemoTask({
    config,
    log,
  });

  const cronDemoTask = CronDemoTask({
    config,
    log,
  });

  scheduler.schedule('demoTask', 60, demoTask);
  cronScheduler.scheduleJob('*/5 * * * *', cronDemoTask);
};
