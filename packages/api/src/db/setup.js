const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

module.exports = async ({ config: { MONGO_URL }, log: parentLog }) => {
  const log = parentLog.create('db/setup');

  const db = await mongoose.connect(MONGO_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
  });

  log.info('database connected');
  return db;
};
