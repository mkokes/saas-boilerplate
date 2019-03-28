const rp = require('request-promise');

module.exports = ({
  log: parentLog,
  config: { API_URL, API_SECRET_KEY },
  Sentry,
}) => {
  const log = parentLog.create('task/apiRunTask');

  return async type => {
    log.info(`Executing API run task ${type}`);

    try {
      await rp.post(`${API_URL}/private/cron/run-task`, {
        form: { key: API_SECRET_KEY, type },
      });
      log.info('OK ✅');
    } catch (err) {
      log.error(`FAILED ❌`);
      log.error(err);

      Sentry.captureException(new Error(err));
    }
  };
};
