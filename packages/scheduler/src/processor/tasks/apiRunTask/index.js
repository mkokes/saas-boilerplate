const rp = require('request-promise');

module.exports = ({
  log: parentLog,
  config: { API_URL, API_SECRET_KEY },
  Sentry,
}) => {
  const log = parentLog.create('task/apiRunTask');

  return async type => {
    // log.info(`executing API run task ${type}`);

    try {
      await rp.post(`${API_URL}/private/processor/run-task`, {
        form: { key: API_SECRET_KEY, type },
      });
    } catch (e) {
      log.error(`FAILED ❌`);
      log.error(e.message);

      Sentry.configureScope(scope => {
        scope.setExtra('task_type', type);
      });
      Sentry.captureException(new Error(e));
    }
  };
};
