const defaultJobOptions = pattern => ({
  removeOnComplete: true,
  removeOnFail: true,
  attempts: 1,
  repeat: {
    cron: pattern,
    tz: 'America/Los_Angeles',
  },
});

module.exports = [defaultJobOptions];
