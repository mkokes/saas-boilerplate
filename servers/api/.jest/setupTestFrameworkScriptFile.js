require('babel-core/register');
require('babel-polyfill');

expect.extend({
  toEqualIgnoreCase: (received, expected) => ({
    message: () => `expected ${received} to equal ${expected} ignoring case`,
    pass:
      expected && received && expected.toLowerCase() === received.toLowerCase(),
  }),
});

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
