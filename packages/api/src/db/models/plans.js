const mongoose = require('mongoose');

/**
 * Plans Schema
 */
const Plans = new mongoose.Schema(
  {
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
      get: num => (num / 100).toFixed(2),
      set: num => num * 100,
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
  },
  {
    toObject: { getters: true },
    toJSON: { getters: true },
  },
);

/**
 * @typedef Plans
 */
module.exports = mongoose.model('Plans', Plans);
