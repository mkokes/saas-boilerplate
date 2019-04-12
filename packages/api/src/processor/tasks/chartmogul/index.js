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

  return async ({ eventType, user, subscription }) => {
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
                lead_created_at: user.signupAt,
                free_trial_started_at: user.trialPeriodStartedAt,
              });

              break;
            }
            case 'CREATE_INVOICE':
              ChartMogul.Invoice.create(config, user._chartmogulCustomerUUID, {
                invoices: [
                  {
                    external_id: undefined, // payment id?
                    date: undefined,
                    currency: 'USD',
                    line_items: [
                      {
                        type: 'subscription',
                        subscription_external_id: undefined, // paddle sub id
                        plan_uuid: undefined,
                        service_period_start: undefined,
                        service_period_end: undefined,
                        amount_in_cents: undefined,
                        quantity: 1,
                        discount_code: undefined,
                        discount_amount_in_cents: undefined,
                        tax_amount_in_cents: undefined,
                        transaction_fees_in_cents: undefined,
                        prorated: undefined,
                      },
                    ],
                    transactions: [
                      {
                        date: undefined,
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
