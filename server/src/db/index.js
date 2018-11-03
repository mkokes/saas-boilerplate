const EventEmitter = require('eventemitter3');

const setupDb = require('./setup');

class Db extends EventEmitter {
  constructor({ nativeDb, log }) {
    super();
    this._nativeDb = nativeDb;
    this._log = log;
  }
}

module.exports = async ({ config, log }) => {
  const nativeDb = await setupDb({ config, log });

  return new Db({ nativeDb, log });
};
