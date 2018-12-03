const bunyan = require('bunyan');

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

module.exports = config =>
  new Log({
    name: 'root',
    streams: [
      {
        level: config.LOG,
        stream: process.stdout,
      },
    ],
    serializers: {
      err: bunyan.stdSerializers.err,
    },
  });
