const config = require('./config');
const setupEventQueue = require('./eventQueue');
const log = require('./log')(config);
const createProcessor = require('./processor');

const init = async () => {
  log.info(`app mode: ${config.APP_MODE}`);

  const eventQueue = setupEventQueue({ log });
  createProcessor({ config, log, eventQueue });
};

init().catch(err => {
  log.error(err);
  console.error(err);
  process.exit(-1);
});
