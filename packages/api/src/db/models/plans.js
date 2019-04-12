const mongoose = require('mongoose');

/**
 * Plans Schema
 */
const Plans = new mongoose.Schema({
  _paddleProductId: {
    type: Number,
    required: true,
    unique: true,
    index: true,
  },
  _chartmogulPlanUUID: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  status: {
    type: String,
    default: 'active',
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  features: {
    type: [String],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  tier: {
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
 * @typedef Plans
 */
module.exports = mongoose.model('Plans', Plans);
