const mongoose = require('mongoose');
const ShortId = require('mongoose-shortid-nodeps');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

/**
 * SupportTicket Schema
 */
const SupportTicketSchema = new mongoose.Schema({
  _ticketId: {
    type: ShortId,
    len: 7,
    base: 64,
    alphabet: 'FTPLKMNWZSQXHJG0123456789',
    retries: 7,
    unique: true,
    uppercase: true,
    index: true,
  },
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
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
SupportTicketSchema.plugin(uniqueValidator, {
  type: 'mongoose-unique-validator',
});

/**
 * @typedef SupportTicket
 */
module.exports = mongoose.model('SupportTicket', SupportTicketSchema);
