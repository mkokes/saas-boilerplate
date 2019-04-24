const mongoose = require('mongoose');
const delay = require('delay');

const { NOTIFICATION, MIXPANEL_EVENT } = require('../constants/events');

const config = require('../config');
const log = require('../log')(config);
const createDb = require('./index');
const Plan = require('../db/models/plans');

describe('db', () => {
  let db;
  let nativeDb;

  beforeAll(async () => {
    db = await createDb({ config, log });
    nativeDb = db._nativeDb;

    await nativeDb.connection.db.dropDatabase();
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

  describe('user', () => {
    it('sign up', async () => {
      const notificationSpy = jest.fn();
      const mixpanelEventSpy = jest.fn();

      db.on(NOTIFICATION, notificationSpy);
      db.on(MIXPANEL_EVENT, mixpanelEventSpy);

      await new Plan({
        internal: true,
        status: 'active',
        name: 'TRIAL',
        displayName: 'Free trial period',
        price: 0,
        createdAt: new Date(),
      }).save();

      const user = await db.signUpUser(
        'user@domain.com',
        'foo123456789',
        'John',
        'Doe',
        'Europe/Madrid',
        '',
        '',
      );

      expect(user).toHaveProperty('_id');

      await delay(100);

      expect(notificationSpy).toHaveBeenCalledTimes(1);
      expect(mixpanelEventSpy).toHaveBeenCalledTimes(3);
    });
  });
});
