const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * Payments Schema
 */
const Payments = new mongoose.Schema({
  _subscription: {
    type: Schema.Types.ObjectId,
    ref: 'Subscriptions',
    default: null,
    index: true,
  },
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    default: null,
    index: true,
  },
  _plan: {
    type: Schema.Types.ObjectId,
    ref: 'Plans',
    default: null,
    index: true,
  },
  _paddleSubscriptionId: {
    type: Number,
    default: null,
    index: true,
  },
  _paddlePlanId: {
    type: String,
    default: null,
    index: true,
  },
  _paddleOrderId: {
    type: String,
    default: null,
    index: true,
  },
  _paddleCheckoutId: {
    type: String,
    default: null,
    index: true,
  },
  _paddleUserId: {
    type: String,
    default: null,
    index: true,
  },
  status: {
    type: String,
    default: 'ok',
  },
  refundType: {
    type: String,
    default: null,
  },
  quantity: {
    type: Number,
    default: null,
  },
  unitPrice: {
    type: Number,
    default: null,
  },
  saleGross: {
    type: Number,
    default: null,
  },
  saleGrossRefund: {
    type: Number,
    default: null,
  },
  feeAmount: {
    type: Number,
    default: null,
  },
  feeRefund: {
    type: Number,
    default: null,
  },
  taxAmount: {
    type: Number,
    default: null,
  },
  taxRefund: {
    type: Number,
    default: null,
  },
  earnings: {
    type: Number,
    default: null,
  },
  earningsDecreased: {
    type: Number,
    default: null,
  },
  currency: {
    type: String,
    default: null,
  },
  customerName: {
    type: String,
    default: null,
  },
  customerCountry: {
    type: String,
    default: null,
  },
  paymentMethod: {
    type: String,
    default: null,
  },
  coupon: {
    type: String,
    default: null,
  },
  receiptURL: {
    type: String,
    default: null,
  },
  receivedAt: {
    type: Date,
    default: Date.now,
  },
  refundedAt: {
    type: Date,
    default: null,
  },
});

/**
 * @typedef Payments
 */
module.exports = mongoose.model('Payments', Payments);
