const Queue = require('bull');
const createRedis = require('./create-redis');

module.exports = ({ log }) => {
  const client = createRedis();
  const subscriber = createRedis();

  return (name, queueOptions) => {
    log.info(`created queue for ${name}`);
    const queue = new Queue(name, {
      createClient(type) {
        switch (type) {
          case 'client':
            return client;
          case 'subscriber':
            return subscriber;
          default:
            return createRedis();
        }
      },
      defaultJobOptions: {
        removeOnComplete: true,
        attempts: 1,
      },
      ...queueOptions,
    });
    // NOTE(@mxstbr): This logs a "Possible event emitter memory leak" warning,
    // but that's a bug upstream in bull. Reference: OptimalBits/bull#503
    queue.on('stalled', job => {
      log.info(`Job#${job.id} stalled, processing again.`);
      // In production log stalled job to Sentry
      // Raven.captureException(new Error(message));
    });
    queue.on('failed', (job, err) => {
      log.info(`Job#${job.id} failed, with following reason`);
      log.error(err);
      // In production log failed job to Sentry
      // Raven.captureException(err);
    });
    return queue;
  };
};
