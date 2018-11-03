const mongoose = require('mongoose');

module.exports = async ({ config: { DB_CONNECTION_URI }, log: parentLog }) => {
  const log = parentLog.create('mlab');

  const db = await mongoose.connect(
    DB_CONNECTION_URI,
    { useNewUrlParser: true },
  );
  log.info('connected to database');

  return db;
};
