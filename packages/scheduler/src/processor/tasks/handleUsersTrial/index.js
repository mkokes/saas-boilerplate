const rp = require('request-promise');

module.exports = ({
  log: parentLog,
  config: { API_URL, API_SECRET_KEY },
  Sentry,
}) => {
  const log = parentLog.create('task/handleUsersTrial');

  return async () => {
    try {
      await rp.post(`${API_URL}/api/private/handle-users-trial`, {
        form: { key: API_SECRET_KEY },
      });
      log.info('OK ✅');
    } catch (err) {
      log.error(`Failed ❌: ${err.message}`);
      Sentry.captureException(new Error(err.message));
    }
  };
};
