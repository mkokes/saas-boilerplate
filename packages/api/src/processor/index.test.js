const EventEmitter = require('eventemitter3');

const {
  NOTIFICATION,
  HANDLE_USERS_TRIAL,
  HANDLE_USERS_SUBSCRIPTION,
  MANAGE_MAILCHIMP_LIST,
} = require('../constants/events');
const config = require('../config');
const log = require('../log')(config);
const createProcessor = require('./index');

const {
  getNotificationSetupArgs,
  getNotificationArgs,
} = require('./tasks/sendNotificationEmail');
const {
  getUsersTrialSetupArgs,
  getUsersTrialArgs,
} = require('./tasks/handleUsersTrial');
const {
  getUsersSubscriptionSetupArgs,
  getUsersSubscriptionArgs,
} = require('./tasks/handleUsersSubscription');
const {
  getMailchimpListSetupArgs,
  getMailchimpListArgs,
} = require('./tasks/manageMailchimpList');

jest.mock('./tasks/sendNotificationEmail', () => {
  let setupArgs;
  let callArgs;

  const fn = args => {
    setupArgs = args;
    return na => {
      callArgs = na;
    };
  };

  fn.getNotificationSetupArgs = () => setupArgs;
  fn.getNotificationArgs = () => callArgs;

  return fn;
});
jest.mock('./tasks/handleUsersTrial', () => {
  let setupArgs;
  let callArgs;

  const fn = args => {
    setupArgs = args;
    return na => {
      callArgs = na;
    };
  };

  fn.getUsersTrialSetupArgs = () => setupArgs;
  fn.getUsersTrialArgs = () => callArgs;

  return fn;
});
jest.mock('./tasks/handleUsersSubscription', () => {
  let setupArgs;
  let callArgs;

  const fn = args => {
    setupArgs = args;
    return na => {
      callArgs = na;
    };
  };

  fn.getUsersSubscriptionSetupArgs = () => setupArgs;
  fn.getUsersSubscriptionArgs = () => callArgs;

  return fn;
});
jest.mock('./tasks/manageMailchimpList', () => {
  let setupArgs;
  let callArgs;

  const fn = args => {
    setupArgs = args;
    return na => {
      callArgs = na;
    };
  };

  fn.getMailchimpListSetupArgs = () => setupArgs;
  fn.getMailchimpListArgs = () => callArgs;

  return fn;
});

describe('processor', () => {
  let db;
  let eventQueue;
  let Sentry;

  beforeAll(async () => {});

  beforeEach(async () => {
    db = new EventEmitter();
    eventQueue = {};
    Sentry = () => {};
  });

  it('handles notifications events', async () => {
    await createProcessor({
      config,
      log,
      eventQueue,
      db,
      Sentry,
    });

    const setupArgs = getNotificationSetupArgs();
    expect(setupArgs.config).toEqual(config);
    expect(setupArgs.db).toEqual(db);
    expect(setupArgs.eventQueue).toEqual(eventQueue);
    expect(setupArgs.Sentry).toEqual(Sentry);

    db.emit(NOTIFICATION, 123);
    expect(getNotificationArgs()).toEqual(123);
  });

  it('handles users_trial events', async () => {
    await createProcessor({
      config,
      log,
      eventQueue,
      db,
      Sentry,
    });

    const setupArgs = getUsersTrialSetupArgs();
    expect(setupArgs.config).toEqual(config);
    expect(setupArgs.db).toEqual(db);
    expect(setupArgs.eventQueue).toEqual(eventQueue);
    expect(setupArgs.Sentry).toEqual(Sentry);

    db.emit(HANDLE_USERS_TRIAL, 123);
    expect(getUsersTrialArgs()).toEqual(123);
  });

  it('handles users_subscription events', async () => {
    await createProcessor({
      config,
      log,
      eventQueue,
      db,
      Sentry,
    });

    const setupArgs = getUsersSubscriptionSetupArgs();
    expect(setupArgs.config).toEqual(config);
    expect(setupArgs.db).toEqual(db);
    expect(setupArgs.eventQueue).toEqual(eventQueue);
    expect(setupArgs.Sentry).toEqual(Sentry);

    db.emit(HANDLE_USERS_SUBSCRIPTION, 123);
    expect(getUsersSubscriptionArgs()).toEqual(123);
  });

  it('handles manage_mailchimp_list events', async () => {
    await createProcessor({
      config,
      log,
      eventQueue,
      db,
      Sentry,
    });

    const setupArgs = getMailchimpListSetupArgs();
    expect(setupArgs.config).toEqual(config);
    expect(setupArgs.eventQueue).toEqual(eventQueue);
    expect(setupArgs.Sentry).toEqual(Sentry);

    db.emit(MANAGE_MAILCHIMP_LIST, 123);
    expect(getMailchimpListArgs()).toEqual(123);
  });
});
