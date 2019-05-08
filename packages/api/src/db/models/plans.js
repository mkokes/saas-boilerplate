const mongoose = require('mongoose');

/**
 * Plans Schema
 */
const Plans = new mongoose.Schema(
  {
    _paddleProductId: {
      type: Number,
      default: null,
      index: true,
    },
    internal: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: 'active',
    },
    name: {
      type: String,
      required: true,
    },
    features: {
      type: [String],
      required: true,
    },
    displayedName: {
      type: String,
      required: true,
    },
    displayedDescription: {
      type: String,
      default: null,
    },
    displayedFeatures: {
      type: [String],
      default: null,
    },
    price: {
      type: Number,
      required: true,
      get: num => (num / 100).toFixed(2),
      set: num => num * 100,
    },
    tier: {
      type: Number,
      default: 0,
    },
    billingInterval: {
      type: String,
      default: null,
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
