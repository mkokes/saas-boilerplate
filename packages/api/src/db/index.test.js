const mongoose = require('mongoose');

const { NOTIFICATION } = require('../constants/events');

const config = require('../config');
const log = require('../log')(config);
const createDb = require('./index');

describe('db', () => {
  let db;
  let nativeDb;

  beforeAll(async () => {
    db = await createDb({ config, log });
    nativeDb = db._nativeDb;
  });

  afterAll(() => nativeDb.connection.close());

  describe('notifyUser', () => {
    it('emits an event', async () => {
      const spy = jest.fn();
      db.on(NOTIFICATION, spy);

      const id = await db.notifyUser(mongoose.Types.ObjectId(), 'type1', {
        foo: 'bar',
      });

      expect(spy).toHaveBeenCalledWith(id);
    });
  });
});
