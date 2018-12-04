const { PROCESS_EMAIL } = require('../../constants/queues');

const createQueue = require('./create-queue.js');

// Normalize our (inconsistent) queue names to a set of JS compatible names
exports.QUEUE_NAMES = {
  processEmail: PROCESS_EMAIL,
};

// Create all the queues, export an object with all the queues
/* eslint-disable no-shadow, no-param-reassign */
const queues = Object.keys(exports.QUEUE_NAMES).reduce((queues, name) => {
  queues[name] = createQueue(exports.QUEUE_NAMES[name]);
  return queues;
}, {});

module.exports = queues;
