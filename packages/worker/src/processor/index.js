const createWorker = require('./queues/create-worker');
const { PROCESS_EMAIL } = require('../constants/queues');
const processEmailDigest = require('./queues/digests/processEmail');
const startJobs = require('./jobs');

module.exports = ({ log: parentLog }) => {
  const log = parentLog.create('processor');

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

  startJobs();

  const PORT = parseInt(process.env.PORT, 10) || 3004;
  server.listen(PORT, 'localhost', 511, () => {
    // prettier-ignore
    log.info(`💉 Healthcheck server running at ${server.address().address}:${server.address().port}`);
  });

  log.info('processor started');
};
