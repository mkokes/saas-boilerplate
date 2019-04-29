const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * Subscriptions Schema
 */
const Subscriptions = new mongoose.Schema(
  {
    _plan: {
      type: Schema.Types.ObjectId,
      ref: 'Plans',
      required: true,
      index: true,
    },
    _user: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
      index: true,
    },
    _paddleSubscriptionId: {
      type: Number,
      default: null,
      index: true,
    },
    _paddlePlanId: {
      type: Number,
      default: null,
      index: true,
    },
    _paddleCheckoutId: {
      type: String,
      default: null,
      index: true,
    },
    _paddleUpdateURL: {
      type: String,
      default: null,
    },
    _paddleCancelURL: {
      type: String,
      default: null,
    },
    price: {
      type: Number,
      default: 0,
      get: num => (num / 100).toFixed(2),
      set: num => num * 100,
    },
    status: {
      type: String,
      default: 'active',
    },
    paymentMethod: {
      type: String,
      default: null,
    },
    paymentStatus: {
      type: String,
      default: null,
    },
    paymentPastDueAt: {
      type: Date,
      default: null,
    },
    paymentCancelledAt: {
      type: Date,
      default: null,
    },
    currency: {
      type: String,
      default: null,
    },
    servicePeriodEnd: {
      type: Date,
      required: true,
    },
    nextBillDateAt: {
      type: Date,
      default: null,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    toObject: { getters: true },
    toJSON: { getters: true },
    timestamps: {
      updatedAt: 'updatedAt',
    },
  },
);

/**
 * @typedef Subscriptions
 */
module.exports = mongoose.model('Subscriptions', Subscriptions);
