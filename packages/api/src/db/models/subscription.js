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
  pastDueAt: {
    type: Date,
    default: null,
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
