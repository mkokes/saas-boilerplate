const PQueue = require('p-queue');

const createQueueClass = ({ config: { APP_MODE }, log }) =>
  class Queue {
    constructor() {
      this._queue = [];
      this._log = log.create('queue');
    }

    enqueue(fn, { name }) {
      if (APP_MODE === 'dev') {
        this._log.debug(`Adding job ${name} to queue ...`);
      }

      this._queue.push({ name, fn });
    }

    dequeue() {
      const { name, fn } = this._queue.shift() || {};

      if (name && APP_MODE === 'dev') {
        this._log.debug(`Running job ${name} from queue ...`);
      }

      return fn;
    }

    get size() {
      return this._queue.length;
    }
  };

module.exports = ({ log }) =>
  new PQueue({
    concurrency: 1,
    autoStart: true,
    queueClass: createQueueClass({ log }),
  });
