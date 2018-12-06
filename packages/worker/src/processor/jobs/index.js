module.exports = ({ log: parentLog }) => {
  const log = parentLog.create('producer');

  const { processEmail } = require('../queues')({ log });

  const defaultJobOptions = pattern => ({
    removeOnComplete: true,
    removeOnFail: true,
    attempts: 1,
    repeat: {
      cron: pattern,
      tz: 'America/Los_Angeles',
    },
  });

  /* We pass undefined because none of the cron-job initaliziers need data */
  const processEmailDigest = () =>
    processEmail.add(undefined, defaultJobOptions('* * * * *'));

  return () => {
    processEmailDigest();
  };
};
