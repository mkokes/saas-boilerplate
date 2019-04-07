const uuid = require('uuid');

const _idn = (id, name) => `${name}-${id}`;

class Scheduler {
  constructor({ config, log }) {
    this._config = config;
    this._log = log.create('scheduler');

    this._jobs = {};
  }

  schedule(name, intervalSeconds, callback) {
    const id = _idn(uuid(), name);

    this._log.info(
      `scheduled job ${id} to run every ${intervalSeconds} seconds`,
    );

    this._jobs[id] = {
      name,
      callback,
      intervalMs: intervalSeconds * 1000,
      lastRun: 0,
    };

    this.start();

    return id;
  }

  unschedule(id) {
    this._log.info(`unschedule job ${id}`);

    delete this._jobs[id];
  }

  start() {
    if (!this._running) {
      this._log.info('start scheduler ...');

      this._running = true;
      this._processJobs();
    }
  }

  stop() {
    if (this._running) {
      this._log.info('stop scheduler ...');

      this._running = false;
      clearTimeout(this._timer);
    }
  }

  _processJobs() {
    if (!this._running) {
      return;
    }

    Object.keys(this._jobs).forEach(id => {
      const job = this._jobs[id];
      const { lastRun, intervalMs, callback } = job;
      const now = Date.now();

      if (now - lastRun >= intervalMs) {
        const { APP_MODE } = this._config;

        if (APP_MODE === 'dev') {
          this._log.debug(`Sending job to queue: ${id} ...`);
        }

        job.lastRun = now;

        callback();
      }
    });

    // check every second
    this._timer = setTimeout(() => this._processJobs(), 1000);
  }
}

module.exports = args => new Scheduler(args);
