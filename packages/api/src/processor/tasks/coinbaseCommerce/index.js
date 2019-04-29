module.exports = ({ log: parentLog, db, eventQueue, Sentry }) => {
  const log = parentLog.create('coinbaseCommerce');

  return async ({
    data: {
      id,
      event: {
        id: eventId,
        type,
        data: { code, description, metadata, pricing },
      },
    },
  }) => {
    eventQueue.add(
      async () => {
        try {
          switch (type) {
            case 'charge:confirmed': {
              const { user_id: userId, plan_id: planId } = metadata;

              await db.cryptoPaymentReceived({
                _user: userId,
                _plan: planId,
                description,
                _coinbaseCommerceChargeCode: code,
                saleGross: pricing.local.amount,
              });
              await db.createSubscription(userId, {
                _user: userId,
                _plan: planId,
                paymentMethod: 'manually',
                paymentStatus: 'cancelled',
                servicePeriodEnd: '2020-01-01',
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
