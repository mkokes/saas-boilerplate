const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');
const uuidv4 = require('uuid/v4');
const Identicon = require('identicon.js');
const ShortId = require('mongoose-shortid-nodeps');

const { Schema } = mongoose;
const SALT_WORK_FACTOR = 10;

/**
 * Users Schema
 */
const UsersSchema = new mongoose.Schema(
  {
    _shortId: {
      type: ShortId,
      len: 5,
      base: 64,
      alphabet: 'VBYRFTPLKMNWZSQXHJG0123456789',
      retries: 10,
      unique: true,
      uppercase: true,
      index: true,
    },
    _subscription: {
      type: Schema.Types.ObjectId,
      ref: 'Subscriptions',
      default: null,
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
    hasTwoFactorAuthenticationEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorAuthenticationSecret: {
      type: String,
      default: null,
    },
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
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
      default: () =>
        new Identicon(uuidv4(), { margin: 0.2, format: 'svg', size: '128' }),
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
    timezone: {
      type: String,
      default: 'America/Los_Angeles',
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
    apiAccountToken: {
      type: String,
      unique: true,
      default: () => uuidv4(),
    },
    apiSecretKey: {
      type: String,
      unique: true,
      default: () => uuidv4(),
    },
    apiAccess: {
      type: String,
      default: 'active',
    },
    apiRegeneratedAt: {
      type: Date,
      default: null,
    },
    lastLoginAt: {
      type: Date,
      default: Date.now,
    },
    signupAt: {
      type: Date,
      default: Date.now,
    },
    signupSource: {
      type: String,
      default: null,
      trim: true,
    },
    signupIP: {
      type: String,
      default: null,
      trim: true,
    },
    signupCity: {
      type: String,
      default: null,
      trim: true,
    },
    signupCountry: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: {
      updatedAt: 'updatedAt',
    },
  },
);

/**
 * Plugins
 */
UsersSchema.plugin(uniqueValidator, {
  type: 'mongoose-unique-validator',
  message: 'Already in use, try another',
});

/**
 * Pre-save hooks
 */
UsersSchema.pre('save', function cb(next) {
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
UsersSchema.methods.comparePassword = async function cb(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Statics
 */
UsersSchema.statics = {};

/**
 * @typedef Users
 */
module.exports = mongoose.model('Users', UsersSchema);
