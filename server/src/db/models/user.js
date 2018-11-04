const Promise = require('bluebird');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');
const uuidv4 = require('uuid/v4');

const SALT_WORK_FACTOR = 10;

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    unique: true,
    index: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    unique: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  passwordResetedAt: {
    type: Date,
    default: null,
  },
  emailConfirmationToken: {
    type: String,
    default: () => uuidv4(),
  },
  isEmailConfirmed: {
    type: Boolean,
    default: false,
  },
  emailConfirmatedAt: {
    type: Date,
    default: null,
  },
  accountStatus: {
    type: String,
    default: 'active',
  },
  tosAcceptedByIp: {
    type: String,
    default: null,
  },
  roles: {
    type: Array,
    default: [],
  },
  ipinfo: {
    type: Object,
    default: null,
  },
  lastSeenAt: {
    type: Date,
    default: Date.now,
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
  refreshToken: {
    type: String,
    default: null,
  },
});

/**
 * Plugins
 */
UserSchema.plugin(uniqueValidator, {
  type: 'mongoose-unique-validator',
  message: 'Already in use',
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
      return next();
    })
    .catch(next);
});

/**
 * Methods
 */
UserSchema.method({
  comparePassword: function cb(candidatePassword, next) {
    bcrypt
      .compare(candidatePassword, this.password)
      .then(res => next(null, res))
      .catch(err => next(err));
  },
});

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
