const bunyan = require('bunyan');
const bsyslog = require('bunyan-syslog');

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
  const {
    APP_MODE,
    PAPERTRAILAPP_HOST,
    PAPERTRAILAPP_PORT,
    SERVER_NAME,
  } = config;

  const streams = [];

  const inTestMode = APP_MODE === 'test';
  const isPapertrailappSetup = PAPERTRAILAPP_HOST && PAPERTRAILAPP_PORT;

  if (isPapertrailappSetup && !inTestMode) {
    streams.push({
      type: 'raw',
      level: 'debug',
      stream: bsyslog.createBunyanStream({
        // type: 'sys',
        facility: bsyslog.local0,
        host: PAPERTRAILAPP_HOST,
        port: PAPERTRAILAPP_PORT,
      }),
    });
  }

  /* eslint-disable indent */
  return new Log({
    name: SERVER_NAME,
    streams: inTestMode
      ? []
      : [
          {
            level: 'debug',
            stream: process.stdout,
          },
          ...streams,
        ],
    serializers: {
      err: bunyan.stdSerializers.err,
    },
    appMode: APP_MODE,
  });
};
