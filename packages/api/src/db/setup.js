const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

module.exports = async ({ config: { DB_DSN }, log: parentLog }) => {
  const log = parentLog.create('db/setup');

  const db = await mongoose.connect(DB_DSN, {
    useCreateIndex: true,
    useNewUrlParser: true,
  });

  log.info('database connected');
  return db;
};
