module.exports = ({ log: parentLog, eventQueue, db, Sentry }) => {
  const log = parentLog.create('paddle');

  return async ({
    body: {
      alert_id: eventId,
      alert_name: eventName,
      status,
      subscription_id: paddleSubscriptionId,
      passthrough,
      subscription_plan_id: paddleSubscriptionPlanId,
      checkout_id: checkoutId,
      new_unit_price: newPrice,
      next_bill_date: nextBillDateAt,
      unit_price: price,
      currency,
      update_url: _paddleUpdateURL,
      cancel_url: _paddleCancelURL,
      order_id: orderId,
      user_id: paddleUserId,
      sale_gross: saleGross,
      fee: feeAmount,
      payment_tax: taxAmount,
      earnings,
      payment_method: paymentMethod,
      coupon,
      receipt_url: _paddleReceiptURL,
      customer_name: customerName,
      country: customerCountry,
      gross_refund: saleGrossRefund,
      earnings_decreased: earningsDecreased,
      fee_refund: feeRefund,
      tax_refund: taxRefund,
      refund_type: refundType,
      old_status: oldSubscriptionStatus,
      old_subscription_plan_id: oldSubscriptionPlanId,
    },
  }) => {
    eventQueue.add(
      async () => {
        try {
          const { user_id: userId } = JSON.parse(passthrough);

          log.debug(`processing ${eventName.toUpperCase()}`);

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

              await db.createSubscription(userId, {
                _plan: plan._id,
                _user: userId,
                _paddleSubscriptionId: paddleSubscriptionId,
                _paddlePlanId: paddleSubscriptionPlanId,
                _paddleCheckoutId: checkoutId,
                price,
                currency,
                _paddleUpdateURL,
                _paddleCancelURL,
                nextBillDateAt,
                servicePeriodEndAt: nextBillDateAt,
                type: 'paddle',
                paymentStatus: 'active',
              });
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
                    _paddleUpdateURL,
                    _paddleCancelURL,
                    price: newPrice,
                    nextBillDateAt,
                    oldSubscriptionStatus,
                    oldSubscriptionPlanId,
                  });

                  break;
                }
                default:
                  throw new Error('no case subscription_updated status');
              }

              break;
            }
            case 'SUBSCRIPTION_CANCELLED': {
              await db.cancelSubscriptionRenewal(paddleSubscriptionId);
              log.info(`paddle subscription ${paddleSubscriptionId} cancelled`);
              break;
            }
            case 'SUBSCRIPTION_PAYMENT_SUCCEEDED': {
              const plan = await db.getPlanIdByPaddleId(
                paddleSubscriptionPlanId,
              );

              await db.subscriptionPaymentReceived({
                _user: userId,
                _plan: plan._id,
                _paddleSubscriptionId: paddleSubscriptionId,
                _paddlePlanId: paddleSubscriptionPlanId,
                _paddleOrderId: orderId,
                _paddleCheckoutId: checkoutId,
                _paddleUserId: paddleUserId,
                saleGross,
                feeAmount,
                earnings,
                taxAmount,
                paymentMethod,
                coupon,
                customerName,
                customerCountry,
                currency,
                _paddleReceiptURL,
                nextBillDateAt,
              });
              break;
            }
            case 'SUBSCRIPTION_PAYMENT_REFUNDED': {
              await db.subscriptionPaymentRefunded(orderId, {
                refundType,
                saleGrossRefund,
                earningsDecreased,
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
            scope.setExtra('eventId', eventId);
            scope.setExtra('eventName', eventName);
          });
          Sentry.captureException(e);
        }
      },
      { name: 'paddle' },
    );
  };
};
