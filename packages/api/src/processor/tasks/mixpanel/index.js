const Mixpanel = require('mixpanel');

module.exports = ({
  config: { MIXPANEL_API_KEY },
  log: parentLog,
  eventQueue,
  Sentry,
}) => {
  const log = parentLog.create('mixpanel');

  return async ({ eventType, args }) => {
    eventQueue.add(
      async () => {
        try {
          const mixpanel = Mixpanel.init(MIXPANEL_API_KEY, {
            protocol: 'https',
          });

          /* eslint-disable default-case */
          switch (eventType) {
            case 'TRACK':
              mixpanel.track(...args);
              break;
            case 'PEOPLE_SET':
              mixpanel.people.set(...args);
              break;
            case 'PEOPLE_SET_ONCE':
              mixpanel.people.set_once(...args);
              break;
            case 'PEOPLE_TRACK_CHARGE':
              mixpanel.people.track_charge(...args);
              break;
          }
        } catch (e) {
          log.error(e.message);

          Sentry.configureScope(scope => {
            scope.setExtra('eventType', eventType);
            scope.setExtra('args', args);
          });
          Sentry.captureException(e);
        }
      },
      { name: 'mixpanel' },
    );
  };
};