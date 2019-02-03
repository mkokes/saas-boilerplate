const DemoTask = require('./tasks/demoTask');

module.exports = async ({ config, log: parentLog, scheduler }) => {
  const log = parentLog.create('processor');

  const demoTask = DemoTask({
    config,
    log,
  });

  scheduler.schedule('demoTask', 10, demoTask);
};
