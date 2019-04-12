const ChartMogul = require('chartmogul-node');

module.exports = ({
  config: {
    CHARTMOGUL_ACCOUNT_TOKEN,
    CHARTMOGUL_SECRET_KEY,
    CHARTMOGUL_DATA_SOURCE_UUID,
  },
  log: parentLog,
  eventQueue,
  // db,
  Sentry,
}) => {
  const log = parentLog.create('chartmogul');

  return async ({ eventType, user, subscription, payment }) => {
    eventQueue.add(
      async () => {
        try {
          const config = ChartMogul.Config(
            CHARTMOGUL_ACCOUNT_TOKEN,
            CHARTMOGUL_SECRET_KEY,
          );

          /* eslint-disable default-case */
          switch (eventType) {
            case 'CREATE_CUSTOMER': {
              await ChartMogul.Customer.create(config, {
                data_source_uuid: CHARTMOGUL_DATA_SOURCE_UUID,
                external_id: user._id,
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
                country: user.signupCountry,
                city: user.signupCity,
              });

              break;
            }
            case 'CREATE_INVOICE':
              ChartMogul.Invoice.create(config, user._chartmogulCustomerUUID, {
                invoices: [
                  {
                    external_id: payment._paddleOrderId,
                    date: new Date().toISOString(),
                    currency: 'USD',
                    line_items: [
                      {
                        type: 'subscription',
                        subscription_external_id: undefined,
                        plan_uuid: undefined,
                        service_period_start: undefined,
                        service_period_end: undefined,
                        amount_in_cents: undefined,
                      },
                    ],
                    transactions: [
                      {
                        date: new Date().toISOString(),
                        type: 'payment',
                        result: 'successful',
                      },
                    ],
                  },
                ],
              });
              break;
            case 'CANCEL_SUBSCRIPTION':
              ChartMogul.Subscription.cancel(
                config,
                subscription._chartmogulCustomerUUID,
              );
              break;
          }
        } catch (e) {
          log.error(e.message);

          Sentry.configureScope(scope => {
            scope.setExtra('eventType', eventType);
          });
          Sentry.captureException(e);
        }
      },
      { name: 'chartmogul' },
    );
  };
};
