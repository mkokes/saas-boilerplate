const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * Subscription Schema
 */
const Subscription = new mongoose.Schema({
  _plan: {
    type: Schema.Types.ObjectId,
    ref: 'Plan',
    required: true,
    index: true,
  },
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  _paddleSubscriptionId: {
    type: Number,
    required: true,
  },
  _paddleCheckoutId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'active',
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
  nextBillDateAt: {
    type: Date,
    required: true,
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
  cancelledAt: {
    type: Date,
    default: null,
  },
  lastUpdatedAt: {
    type: Date,
    default: null,
  },
});

/**
 * @typedef Subscription
 */
module.exports = mongoose.model('Subscription', Subscription);
