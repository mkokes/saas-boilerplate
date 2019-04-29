const mongoose = require('mongoose');
const ShortId = require('mongoose-shortid-nodeps');

const { Schema } = mongoose;

/**
 * Payments Schema
 */
const Payments = new mongoose.Schema(
  {
    _shortId: {
      type: ShortId,
      len: 5,
      base: 64,
      alphabet: 'VBYRFTPLKMNWZSQXHJG0123456789',
      retries: 10,
      unique: true,
      uppercase: true,
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
      default: 0,
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
    _paddleReceiptURL: {
      type: String,
      default: null,
    },
    _coinbaseCommerceChargeCode: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      default: 'ok',
    },
    refundType: {
      type: String,
      default: null,
    },
    saleGross: {
      type: Number,
      default: 0,
      get: num => (num / 100).toFixed(2),
      set: num => num * 100,
    },
    saleGrossRefund: {
      type: Number,
      default: 0,
      get: num => (num / 100).toFixed(2),
      set: num => num * 100,
    },
    feeAmount: {
      type: Number,
      default: 0,
      get: num => (num / 100).toFixed(2),
      set: num => num * 100,
    },
    feeRefund: {
      type: Number,
      default: 0,
      get: num => (num / 100).toFixed(2),
      set: num => num * 100,
    },
    taxAmount: {
      type: Number,
      default: 0,
      get: num => (num / 100).toFixed(2),
      set: num => num * 100,
    },
    taxRefund: {
      type: Number,
      default: 0,
      get: num => (num / 100).toFixed(2),
      set: num => num * 100,
    },
    earnings: {
      type: Number,
      default: 0,
      get: num => (num / 100).toFixed(2),
      set: num => num * 100,
    },
    earningsDecreased: {
      type: Number,
      default: 0,
      get: num => (num / 100).toFixed(2),
      set: num => num * 100,
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
    receivedAt: {
      type: Date,
      default: Date.now,
    },
    refundedAt: {
      type: Date,
      default: null,
    },
  },
  {
    toObject: { getters: true },
    toJSON: { getters: true },
  },
);

/**
 * @typedef Payments
 */
module.exports = mongoose.model('Payments', Payments);
