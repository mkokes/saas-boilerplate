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

  return async ({ eventType, user, subscription, payment, isProrated }) => {
    eventQueue.add(
      async () => {
        try {
          const config = new ChartMogul.Config(
            CHARTMOGUL_ACCOUNT_TOKEN,
            CHARTMOGUL_SECRET_KEY,
          );

          /* eslint-disable default-case */
          switch (eventType) {
            case 'CREATE_CUSTOMER': {
              const _user = user;

              const customer = await ChartMogul.Customer.create(config, {
                data_source_uuid: CHARTMOGUL_DATA_SOURCE_UUID,
                external_id: user._id,
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
                country: user.signupCountry,
                city: user.signupCity,
                lead_created_at: user.signupAt,
                free_trial_started_at: user.trialPeriodStartedAt,
              });

              _user._chartmogulCustomerUUID = customer.uuid;
              await _user.save();

              log.info(`Created customer for user ${_user._id}`);
              break;
            }
            case 'CREATE_INVOICE':
              ChartMogul.Invoice.create(config, user._chartmogulCustomerUUID, {
                invoices: [
                  {
                    external_id: payment._id,
                    date: payment.receivedAt,
                    currency: 'USD',
                    line_items: [
                      {
                        type: 'subscription',
                        subscription_external_id: subscription._id,
                        plan_uuid: subscription._plan._chartmogulPlanUUID,
                        service_period_start: subscription.subscribedAt,
                        service_period_end: subscription.servicePeriodEnd,
                        amount_in_cents: subscription.unitPrice,
                        quantity: 1,
                        tax_amount_in_cents: payment.taxAmount,
                        transaction_fees_in_cents: payment.feesAmount,
                        prorated: isProrated,
                      },
                    ],
                    transactions: [
                      {
                        date: payment.receivedAt,
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
                subscription._paddleSubscriptionId,
                {
                  cancelled_at: new Date(),
                },
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
