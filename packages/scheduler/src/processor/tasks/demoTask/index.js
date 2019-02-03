module.exports = ({ log: parentLog }) => {
  const log = parentLog.create('demoTask');

  return () => {
    try {
      log.info(`Running demoTask ...`);
      setTimeout(() => {
        log.info('DONE ✅');
      }, 5000);
    } catch (err) {
      log.error('Failed', err);
    }
  };
};
