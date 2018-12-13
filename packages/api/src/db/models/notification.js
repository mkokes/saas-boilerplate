const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * Notification Schema
 */
const NotificationSchema = new mongoose.Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  },
  type: {
    type: String,
    required: true,
  },
  data: {
    type: Schema.Types.Mixed,
    default: null,
  },
  emailSent: {
    type: Boolean,
    default: false,
    index: true,
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
