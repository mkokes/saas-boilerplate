const rp = require('request-promise');

module.exports = ({ log: parentLog, config, Sentry }) => {
  const log = parentLog.create('task/handleUsersTrial');

  return async () => {
    try {
      await rp.post(`${config.API_URL}/api/private/handle-users-trial`, {
        form: { key: config.API_SECRET_KEY },
      });
      log.info('OK ✅');
    } catch (err) {
      log.error(`Failed ❌: ${err.message}`);
      Sentry.captureException(new Error(err.message));
    }
  };
};
