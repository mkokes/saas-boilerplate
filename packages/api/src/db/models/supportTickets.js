const mongoose = require('mongoose');
const ShortId = require('mongoose-shortid-nodeps');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

/**
 * SupportTickets Schema
 */
const SupportTicketsSchema = new mongoose.Schema({
  _ticketId: {
    type: ShortId,
    len: 7,
    base: 64,
    alphabet: 'FTPLKMNWZSQXHJG0123456789',
    retries: 10,
    unique: true,
    uppercase: true,
    index: true,
  },
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    default: null,
    index: true,
  },
  requesterName: {
    type: String,
    required: true,
    trim: true,
  },
  requesterEmail: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    index: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  requestedAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Plugins
 */
SupportTicketsSchema.plugin(uniqueValidator, {
  type: 'mongoose-unique-validator',
});

/**
 * @typedef SupportTicket
 */
module.exports = mongoose.model('SupportTickets', SupportTicketsSchema);
