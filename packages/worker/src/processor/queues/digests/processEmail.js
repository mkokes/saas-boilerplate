module.exports = ({ log: parentLog, eventQueue }) => {
  const log = parentLog.create('processEmail');

  return () =>
    eventQueue.add(
      async () => {
        try {
          log.info(`Running job`);
        } catch (err) {
          log.error(err);
          // Raven.captureException(err);
        }
      },
      { name: 'processEmail' },
    );
};
