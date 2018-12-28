const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

module.exports = async ({ config: { DB_CONNECTION_URI }, log: parentLog }) => {
  const log = parentLog.create('db/setup');

  const db = await mongoose.connect(
    DB_CONNECTION_URI,
    { useCreateIndex: true, useNewUrlParser: true },
  );

  return db;
};
