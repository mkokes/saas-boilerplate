const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');

const { Schema } = mongoose;

/**
 * resetPasswordToken Schema
 */
const ResetPasswordTokens = new mongoose.Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    index: true,
    required: true,
  },
  token: {
    type: String,
    unique: true,
    index: true,
    default: () => uuidv4(),
  },
  used: {
    type: Boolean,
    default: false,
  },
  usedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * @typedef resetPasswordTokens
 */
module.exports = mongoose.model('ResetPasswordTokens', ResetPasswordTokens);
