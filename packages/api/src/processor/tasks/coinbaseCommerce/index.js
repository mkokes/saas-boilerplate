module.exports = ({ log: parentLog, db, eventQueue, Sentry }) => {
  const log = parentLog.create('coinbaseCommerce');

  return async ({
    data: {
      id,
      event: {
        id: eventId,
        type,
        metadata,
        data: { pricing },
      },
    },
  }) => {
    eventQueue.add(
      async () => {
        try {
          switch (type) {
            case 'charge:confirmed': {
              const { user_id: userId, plan_id: planId } = JSON.parse(metadata);

              await db.cryptoPaymentReceived({
                _user: userId,
                _plan: planId,
                saleGross: pricing.local.amount,
              });
              break;
            }
            default:
              throw new Error('unhandled event');
          }
        } catch (e) {
          log.error(e.message);

          Sentry.configureScope(scope => {
            scope.setExtra('webhook_id', id);
            scope.setExtra('event_id', eventId);
            scope.setExtra('type', type);
          });
          Sentry.captureException(e);
        }
      },
      { name: 'coinbaseCommerce' },
    );
  };
};
