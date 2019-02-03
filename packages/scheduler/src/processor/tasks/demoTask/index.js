const request = require('request');

module.exports = ({ log: parentLog }) => {
  const log = parentLog.create('demoTask');

  return () => {
    try {
      request('https://example.com/url?a=b', function(error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(body);
        }
      });

      log.info(`Running demoTask ...`);
      setTimeout(() => {
        log.info('DONE ✅');
      }, 5000);
    } catch (err) {
      log.error('Failed', err);
    }
  };
};
