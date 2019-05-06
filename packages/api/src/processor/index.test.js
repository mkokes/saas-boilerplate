const EventEmitter = require('eventemitter3');

const {
  NOTIFICATION,
  HANDLE_USERS_TRIAL,
  HANDLE_USERS_SUBSCRIPTION,
  MAILCHIMP,
  MIXPANEL_EVENT,
  PADDLE,
  COINBASE_COMMERCE,
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
} = require('./tasks/mailchimp');
const {
  getMixpanelEventSetupArgs,
  getMixpanelEventArgs,
} = require('./tasks/mixpanel');
const { getPaddleSetupArgs, getPaddleArgs } = require('./tasks/paddle');
const {
  getCoinbaseCommerceSetupArgs,
  getCoinbaseCommerceArgs,
} = require('./tasks/coinbaseCommerce');

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

jest.mock('./tasks/mailchimp', () => {
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

jest.mock('./tasks/mixpanel', () => {
  let setupArgs;
  let callArgs;

  const fn = args => {
    setupArgs = args;
    return na => {
      callArgs = na;
    };
  };

  fn.getMixpanelEventSetupArgs = () => setupArgs;
  fn.getMixpanelEventArgs = () => callArgs;

  return fn;
});

jest.mock('./tasks/paddle', () => {
  let setupArgs;
  let callArgs;

  const fn = args => {
    setupArgs = args;
    return na => {
      callArgs = na;
    };
  };

  fn.getPaddleSetupArgs = () => setupArgs;
  fn.getPaddleArgs = () => callArgs;

  return fn;
});
jest.mock('./tasks/coinbaseCommerce', () => {
  let setupArgs;
  let callArgs;

  const fn = args => {
    setupArgs = args;
    return na => {
      callArgs = na;
    };
  };

  fn.getCoinbaseCommerceSetupArgs = () => setupArgs;
  fn.getCoinbaseCommerceArgs = () => callArgs;

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

  it('handles mailchimp events', async () => {
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

    db.emit(MAILCHIMP, 123);
    expect(getMailchimpListArgs()).toEqual(123);
  });

  it('handles send_mixpanel_event events', async () => {
    await createProcessor({
      config,
      log,
      eventQueue,
      db,
      Sentry,
    });

    const setupArgs = getMixpanelEventSetupArgs();
    expect(setupArgs.config).toEqual(config);
    expect(setupArgs.eventQueue).toEqual(eventQueue);
    expect(setupArgs.Sentry).toEqual(Sentry);

    db.emit(MIXPANEL_EVENT, 123);
    expect(getMixpanelEventArgs()).toEqual(123);
  });

  it('handles handle_paddle_webhook events', async () => {
    await createProcessor({
      config,
      log,
      eventQueue,
      db,
      Sentry,
    });

    const setupArgs = getPaddleSetupArgs();
    expect(setupArgs.db).toEqual(db);
    expect(setupArgs.eventQueue).toEqual(eventQueue);
    expect(setupArgs.Sentry).toEqual(Sentry);

    db.emit(PADDLE, 123);
    expect(getPaddleArgs()).toEqual(123);
  });

  it('handles coinbase_commerce events', async () => {
    await createProcessor({
      log,
      db,
      eventQueue,
      Sentry,
    });

    const setupArgs = getPaddleSetupArgs();
    expect(setupArgs.db).toEqual(db);
    expect(setupArgs.eventQueue).toEqual(eventQueue);
    expect(setupArgs.Sentry).toEqual(Sentry);

    db.emit(COINBASE_COMMERCE, 123);
    expect(getCoinbaseCommerceArgs()).toEqual(123);
  });
});
