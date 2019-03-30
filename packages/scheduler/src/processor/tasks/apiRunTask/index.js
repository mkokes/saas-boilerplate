const rp = require('request-promise');

module.exports = ({
  log: parentLog,
  config: { API_URL, API_SECRET_KEY },
  Sentry,
}) => {
  const log = parentLog.create('task/apiRunTask');

  return async type => {
    Sentry.configureScope(scope => {
      scope.setExtra('task_type', type);
    });

    log.info(`executing API run task ${type}`);

    try {
      await rp.post(`${API_URL}/private/processor/run-task`, {
        form: { key: API_SECRET_KEY, type },
      });
      log.info('OK ✅');
    } catch (err) {
      log.error(`FAILED ❌`);
      Sentry.captureException(new Error(err));
    }
  };
};
