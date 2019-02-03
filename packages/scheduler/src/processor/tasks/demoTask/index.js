module.exports = ({ log: parentLog }) => {
  const log = parentLog.create('demoTask');

  try {
    log.info(`Running demoTask ...`);
    log.info('DONE ✅');
  } catch (err) {
    log.error('Failed', err);
  }
};
