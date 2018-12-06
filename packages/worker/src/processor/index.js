const { PROCESS_EMAIL } = require('../constants/queues');

module.exports = ({ log: parentLog, eventQueue }) => {
  const log = parentLog.create('processor');

  const processEmailDigest = require('./queues/digests/processEmail')({
    log,
    eventQueue,
  });

  const createWorker = require('./queues/create-worker')({ log });
  const server = createWorker(
    {
      [PROCESS_EMAIL]: processEmailDigest,
    },
    {
      settings: {
        lockDuration: 600000, // Key expiration time for job locks.
        stalledInterval: 0, // How often check for stalled jobs (use 0 for never checking).
        maxStalledCount: 0, // Max amount of times a stalled job will be re-processed.
      },
    },
  );

  const initDelayedJobs = require('./jobs')({ log });
  initDelayedJobs();

  const PORT = parseInt(process.env.PORT, 10) || 3004;
  server.listen(PORT, 'localhost', 511, () => {
    // prettier-ignore
    log.info(`💉 Healthcheck server running at ${server.address().address}:${server.address().port}`);
  });
};
