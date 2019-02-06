const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * Notification Schema
 */
const NotificationSchema = new mongoose.Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true,
  },
  type: {
    type: String,
    required: true,
  },
  variables: {
    type: Schema.Types.Mixed,
    default: null,
  },
  sent: {
    type: Boolean,
    default: false,
  },
  generatedAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * @typedef Notification
 */
module.exports = mongoose.model('Notification', NotificationSchema);
