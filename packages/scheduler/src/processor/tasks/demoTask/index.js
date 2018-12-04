/* function scaryClown() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('🤡');
    }, 2500);
  });
} */

module.exports = ({ log: parentLog, eventQueue }) => {
  const log = parentLog.create('demoTask');

  return () =>
    eventQueue.add(
      async () => {
        try {
          log.info(`Running task ...`);
          log.info('DONE 🤡');
        } catch (err) {
          log.error('Failed', err);
        }
      },
      { name: 'refreshActivePartyData' },
    );
};
