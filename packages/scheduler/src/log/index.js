const bunyan = require('bunyan');
const { BunyanStream: LogDnaStream } = require('logdna-bunyan');

class Log {
  constructor(opts) {
    this._opts = opts;
    this._name = opts.name;
    this._log = bunyan(opts);
    ['trace', 'debug', 'info', 'warn', 'error'].forEach(fn => {
      this[fn] = (...args) => {
        const obj = {};

        // an error object should get passed through specially
        obj.err = args.find(a => a.stack && a.message);

        this._log[fn].apply(this._log, [obj, ...args]);
      };
    });
  }

  create(name) {
    return new Log({
      ...this._opts,
      name: `${this._name}/${name}`,
    });
  }
}

module.exports = config => {
  const streams = [];
  const inTestMode = config.APP_MODE === 'test';

  if (config.LOGDNA_API_KEY && !inTestMode) {
    streams.push({
      type: 'raw',
      level: config.LOG,
      stream: new LogDnaStream({ key: config.LOGDNA_API_KEY }),
    });
  }

  /* eslint-disable indent */
  return new Log({
    name: 'root',
    streams: inTestMode
      ? []
      : [
          {
            level: config.LOG,
            stream: process.stdout,
          },
          ...streams,
        ],
    serializers: {
      err: bunyan.stdSerializers.err,
    },
    appMode: config.APP_MODE,
  });
};
