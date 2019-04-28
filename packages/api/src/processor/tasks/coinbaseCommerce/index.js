module.exports = ({ log: parentLog, eventQueue, Sentry }) => {
  const log = parentLog.create('coinbaseCommerce');

  return async ({ event }) => {
    const { id, type } = event;

    eventQueue.add(
      async () => {
        try {
          switch (type) {
            case 'charge:confirmed': {
              break;
            }
            default:
              throw new Error('unhandled event');
          }
        } catch (e) {
          log.error(e.message);

          Sentry.configureScope(scope => {
            scope.setExtra('id', id);
            scope.setExtra('type', type);
          });
          Sentry.captureException(e);
        }
      },
      { name: 'coinbaseCommerce' },
    );
  };
};
