const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * Payment Schema
 */
const Payment = new mongoose.Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true,
  },
  _subscription: {
    type: Schema.Types.ObjectId,
    ref: 'Subscription',
    default: null,
    index: true,
  },
  _plan: {
    type: Schema.Types.ObjectId,
    ref: 'Plan',
    default: null,
    index: true,
  },
  _paddleOrderId: {
    type: String,
    default: null,
  },
  _paddleCheckoutId: {
    type: String,
    default: null,
  },
  _paddleUserId: {
    type: String,
    default: null,
  },
  status: {
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
  fee: {
    type: Number,
    default: null,
  },
  tax: {
    type: Number,
    default: null,
  },
  saleGrossRefund: {
    type: Number,
    default: null,
  },
  feeRefund: {
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
  usedCoupon: {
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
});

/**
 * @typedef Payment
 */
module.exports = mongoose.model('Payment', Payment);
