const mongoose = require('mongoose');

/**
 * Plan Schema
 */
const Plan = new mongoose.Schema({
  _paddleProductId: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: 'active',
  },
  displayName: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  billingInterval: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * @typedef Plan
 */
module.exports = mongoose.model('Plan', Plan);
