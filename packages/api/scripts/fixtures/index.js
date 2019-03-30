const Fixtures = require('node-mongodb-fixtures');
const fixtures = new Fixtures({
  dir: 'scripts/fixtures/data',
  mute: true,
});

fixtures
  .connect('mongodb://localhost:27017/api-saas-boilerplate')
  .then(() => fixtures.unload())
  .then(() => fixtures.load())
  .then(() => fixtures.disconnect());

/* eslint-disable-next-line no-console */
console.log('database fixtures generated');
