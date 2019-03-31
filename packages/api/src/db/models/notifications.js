const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * Notifications Schema
 */
const NotificationsSchema = new mongoose.Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
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
 * @typedef Notifications
 */
module.exports = mongoose.model('Notifications', NotificationsSchema);
