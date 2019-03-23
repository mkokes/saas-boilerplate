const rp = require('request-promise');

module.exports = ({
  log: parentLog,
  config: { API_URL, API_SECRET_KEY },
  Sentry,
}) => {
  const log = parentLog.create('task/apiRequest');

  return async (method, url) => {
    log.info(`Executing API request method: ${method} url: ${url}`);

    try {
      await rp[method](`${API_URL}/private${url}`, {
        form: { key: API_SECRET_KEY },
      });
      log.info('OK ✅');
    } catch (err) {
      log.error(`FAILED ❌`);
      log.error(err);

      Sentry.captureException(new Error(err));
    }
  };
};
