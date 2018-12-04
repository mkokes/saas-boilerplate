const { processEmail } = require('../queues');

const defaultJobOptions = pattern => ({
  removeOnComplete: true,
  removeOnFail: true,
  attempts: 1,
  repeat: {
    cron: pattern,
    tz: 'America/Los_Angeles',
  },
});

/*
  None of the cron-job initaliziers need data in the Job, so we pass undefined
  as the data argument to the queue
*/

const processEmailDigest = () =>
  // Every morning
  processEmail.add(undefined, defaultJobOptions('0 6 * * 1'));

module.exports = () => {
  processEmailDigest();
};
