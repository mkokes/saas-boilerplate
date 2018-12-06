const http = require('http');
// const Raven = require('shared/raven');

module.exports = ({ log: parentLog }) => {
  const log = parentLog.create('worker');

  const createQueue = require('./create-queue')({ log });

  // Helper function to sum properties of an array of objects
  // e.g. [{ completed: 6 }, { completed: 2 }] => 8
  const sumArr = (input, prop) =>
    input.reduce((sum, item) => sum + item[prop], 0);

  return (queueMap, queueOptions) => {
    // Start processing the queues
    const queues = Object.keys(queueMap).map(name => {
      const queue = createQueue(name, queueOptions);
      queue.process(queueMap[name]);
      return queue;
    });

    // Return the job count when requesting anything via HTTP
    return http.createServer((req, res) => {
      res.setHeader('Content-Type', 'application/json');
      // Summarize the data across all the queues
      Promise.all(queues.map(queue => queue.getJobCounts())).then(jobCounts => {
        const data = {
          waiting: sumArr(jobCounts, 'waiting'),
          active: sumArr(jobCounts, 'active'),
          completed: sumArr(jobCounts, 'completed'),
          failed: sumArr(jobCounts, 'failed'),
          delayed: sumArr(jobCounts, 'delayed'),
        };

        res.end(JSON.stringify(data, null, 2));
      });
    });
  };
};
