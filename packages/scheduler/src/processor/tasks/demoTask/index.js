const rp = require('request-promise');

module.exports = ({ log: parentLog, config, Sentry }) => {
  const log = parentLog.create('demoTask');

  return async () => {
    try {
      await rp(`${config.API_URL}/tasks/ping`);

      log.info('OK ✅');
    } catch (err) {
      log.error(`Failed ❌: ${err.message}`);
      Sentry.captureException(new Error(err.message));
    }
  };
};
