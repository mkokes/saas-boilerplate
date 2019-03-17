const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * SupportTicket Schema
 */
const SupportTicketSchema = new mongoose.Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true,
  },
  requesterName: {
    type: String,
    required: true,
  },
  requesterEmail: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  requestedAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * @typedef SupportTicket
 */
module.exports = mongoose.model('SupportTicket', SupportTicketSchema);
