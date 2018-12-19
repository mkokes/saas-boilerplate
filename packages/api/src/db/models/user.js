const Promise = require('bluebird');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');
const uuidv4 = require('uuid/v4');
const Identicon = require('identicon.js');

const SALT_WORK_FACTOR = 10;

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    unique: true,
    index: true,
  },
  emailConfirmationToken: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  passwordUpdatedAt: {
    type: Date,
    default: null,
  },
  isTwoFactorAuthenticationEnabled: {
    type: Boolean,
    default: false,
  },
  fullName: {
    type: String,
    trim: true,
    required: true,
  },
  nickname: {
    type: String,
    trim: true,
    index: true,
    required: true,
  },
  avatar: {
    type: String,
    default: () => new Identicon(uuidv4(), { format: 'svg', size: '128' }),
  },
  isSignUpEmailConfirmed: {
    type: Boolean,
    default: false,
  },
  emailConfirmedAt: {
    type: Date,
    default: null,
  },
  accountStatus: {
    type: String,
    default: 'active',
  },
  roles: {
    type: Array,
    default: [],
  },
  legal: {
    type: Array,
    default: [
      { type: 'TERMS_AND_CONDITIONS', accepted: Date.now().toString() },
      { type: 'PRIVACY_POLICY', accepted: Date.now().toString() },
      { type: 'MARKETING_INFO', accepted: Date.now().toString() },
    ],
  },
  lastLoginAt: {
    type: Date,
    default: Date.now,
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Plugins
 */
UserSchema.plugin(uniqueValidator, {
  type: 'mongoose-unique-validator',
  message: 'Already in use, try another',
});

/**
 * Pre-save hooks
 */
UserSchema.pre('save', function cb(next) {
  const user = this;

  if (!user.isModified('password')) return next();

  return bcrypt
    .hash(user.password, SALT_WORK_FACTOR)
    .then(hash => {
      user.password = hash;
      user.passwordUpdatedAt = Date.now();
      return next();
    })
    .catch(next);
});

/**
 * Methods
 */
UserSchema.methods.comparePassword = async function cb(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Statics
 */
UserSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then(user => {
        if (user) {
          return user;
        }
        return Promise.reject(new Error('user not found'));
      });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  },
};

/**
 * @typedef User
 */
module.exports = mongoose.model('User', UserSchema);
