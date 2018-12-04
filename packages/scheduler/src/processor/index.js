const DemoTask = require('./tasks/demoTask');

module.exports = async ({ config, log: parentLog, eventQueue, scheduler }) => {
  const log = parentLog.create('processor');
  log.info('processor started');

  const demoTask = DemoTask({
    config,
    log,
    eventQueue,
  });

  scheduler.schedule('demoTask', 10, demoTask);
};
