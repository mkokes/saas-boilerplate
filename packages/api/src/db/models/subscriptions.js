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
      required: true,
      unique: true,
      index: true,
    },
    _paddlePlanId: {
      type: Number,
      required: true,
      index: true,
    },
    _paddleCheckoutId: {
      type: String,
      required: true,
      index: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    unitPrice: {
      type: Number,
      required: true,
      get: num => (num / 100).toFixed(2),
      set: num => num * 100,
    },
    status: {
      type: String,
      default: 'active',
    },
    paymentStatus: {
      type: String,
      default: 'active',
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
      required: true,
    },
    updateURL: {
      type: String,
      required: true,
    },
    cancelURL: {
      type: String,
      required: true,
    },
    servicePeriodEnd: {
      type: Date,
      required: true,
    },
    nextBillDateAt: {
      type: Date,
      required: true,
    },
    subscriptionStartedAt: {
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
