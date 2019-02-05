const rp = require('request-promise');

module.exports = ({ log: parentLog, config, Sentry }) => {
  const log = parentLog.create('cronDemoTask');

  return async () => {
    try {
      await rp(`${config.API_URL}/tasks/ping`);

      log.info('OKK ✅');
    } catch (err) {
      Sentry.captureException(err);
    }
  };
};
