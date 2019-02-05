const request = require('request');

module.exports = ({ log: parentLog, config }) => {
  const log = parentLog.create('cronDemoTask');

  return () => {
    try {
      request(`${config.API_URL}/tasks/ping`, (error, response) => {
        if (error) throw error;

        if (response.statusCode === 200) {
          log.info('OKK ✅');
        }
      });
    } catch (err) {
      log.error(`❌ Error:`, err);
    }
  };
};
