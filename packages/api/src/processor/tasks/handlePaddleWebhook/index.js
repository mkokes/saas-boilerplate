const delay = require('delay');
const safeGet = require('lodash.get');
const Moment = require('moment');

module.exports = ({ log: parentLog, eventQueue, db, Sentry }) => {
  const log = parentLog.create('handlePaddleWebhook');

  return async ({
    body: {
      alert_name: eventName,
      status,
      subscription_id: paddleSubscriptionId,
      passthrough,
      subscription_plan_id: paddleSubscriptionPlanId,
      checkout_id: checkoutId,
      quantity,
      new_quantity: newQuantity,
      new_unit_price: newUnitPrice,
      next_bill_date: nextBillDate,
      unit_price: unitPrice,
      currency,
      update_url: updateURL,
      cancel_url: cancelURL,
      order_id: orderId,
      user_id: userId,
      sale_gross: saleGross,
      fee,
      earnings,
      payment_tax: tax,
      payment_method: paymentMethod,
      coupon,
      receipt_url: receiptURL,
      customer_name: customerName,
      country: customerCountry,
      amount: amountRefund,
      gross_refund: saleGrossRefund,
      tax_refund: taxRefund,
      fee_refund: feeRefund,
    },
  }) => {
    eventQueue.add(
      async () => {
        try {
          const user = JSON.parse(passthrough);

          let nextBillDateAt;
          if (nextBillDate) {
            nextBillDateAt = Moment(nextBillDate)
              .startOf('day')
              .toDate();
          }

          switch (eventName.toUpperCase()) {
            case 'SUBSCRIPTION_CREATED': {
              const plan = await db.getPlanIdByPaddleId(
                paddleSubscriptionPlanId,
              );
              if (!plan) {
                throw new Error(
                  `Plan not found: Paddle ID. ${paddleSubscriptionPlanId}`,
                );
              }

              await db.createSubscription(user._id, {
                _plan: plan._id,
                _user: user._id,
                _paddleSubscriptionId: paddleSubscriptionId,
                _paddlePlanId: paddleSubscriptionPlanId,
                _paddleCheckoutId: checkoutId,
                quantity,
                unitPrice,
                currency,
                updateURL,
                cancelURL,
                nextBillDateAt,
                accessUntil: nextBillDateAt,
              });

              log.info(`subscription created for user ${user._id}`);
              break;
            }
            case 'SUBSCRIPTION_UPDATED': {
              const subscription = await db.getSubscriptionByPaddleId(
                paddleSubscriptionId,
              );
              if (!subscription) {
                throw new Error(
                  `Subscription not found: Paddle ID. ${paddleSubscriptionId}`,
                );
              }

              switch (status) {
                case 'past_due': {
                  await db.subscriptionPaymentPastDue(subscription._id);
                  log.info(`subscription ${subscription._id} past due`);
                  break;
                }
                case 'active': {
                  const plan = await db.getPlanIdByPaddleId(
                    paddleSubscriptionPlanId,
                  );
                  if (!plan) {
                    throw new Error(
                      `Plan not found: Paddle plan ID. ${paddleSubscriptionPlanId}`,
                    );
                  }

                  await db.subscriptionUpdated(subscription._id, {
                    _plan: plan._id,
                    _paddlePlanId: paddleSubscriptionPlanId,
                    _paddleCheckoutId: checkoutId,
                    updateURL,
                    cancelURL,
                    quantity: newQuantity,
                    unitPrice: newUnitPrice,
                    nextBillDateAt,
                    accessUntil: nextBillDateAt,
                  });

                  log.info(`subscription ${subscription._id} updated`);
                  break;
                }
                default:
                  throw new Error('no case subscription_updated status');
              }

              break;
            }
            case 'SUBSCRIPTION_CANCELLED': {
              await db.cancelSubscriptionPaymentMethod(paddleSubscriptionId);
              log.info(`paddle subscription ${paddleSubscriptionId} cancelled`);
              break;
            }
            case 'SUBSCRIPTION_PAYMENT_SUCCEEDED': {
              const plan = await db.getPlanIdByPaddleId(
                paddleSubscriptionPlanId,
              );

              delay(2000); // wait 2s for user subscription creation (race condition)
              const userSubscription = await db.getUserSubscription(user._id);

              await db.subscriptionPaymentReceived({
                _subscription: safeGet(userSubscription, '_id') || undefined,
                _user: user._id,
                _plan: plan._id,
                _paddleSubscriptionId: paddleSubscriptionId,
                _paddlePlanId: paddleSubscriptionPlanId,
                _paddleOrderId: orderId,
                _paddleCheckoutId: checkoutId,
                _paddleUserId: userId,
                quantity,
                unitPrice,
                saleGross,
                fee,
                earnings,
                tax,
                paymentMethod,
                coupon,
                customerName,
                customerCountry,
                currency,
                receiptURL,
                nextBillDateAt,
              });

              log.info(`payment succeded from user ${user._id} for`);
              break;
            }
            case 'SUBSCRIPTION_PAYMENT_REFUNDED': {
              await db.subscriptionPaymentRefunded(orderId, {
                amountRefund,
                saleGrossRefund,
                feeRefund,
                taxRefund,
              });
              break;
            }
            default:
              throw new Error('unhandled event');
          }
        } catch (e) {
          log.error(e.message);

          Sentry.configureScope(scope => {
            scope.setExtra('eventName', eventName);
            scope.setExtra('passthrough', passthrough);
          });
          Sentry.captureException(e);
        }
      },
      { name: 'handlePaddleWebhook' },
    );
  };
};
