const { ApolloError, UserInputError } = require('apollo-server-koa');
const EventEmitter = require('eventemitter3');

const { validateRecaptchaResponse } = require('../utils/recaptcha');
const setupDb = require('./setup');
const User = require('./models/user');
const { NOTIFICATION } = require('../constants/events');
const { VERIFY_EMAIL } = require('../constants/notifications');

class Db extends EventEmitter {
  constructor({ config, nativeDb, log: parentLog }) {
    super();
    this._config = config;
    this._nativeDb = nativeDb;
    this._log = parentLog.create('db/core');
  }

  async notifyUser(userId, type, data) {
    const obj = {
      _user: userId,
      type,
      data,
      email_sent: false,
      seen: false,
    };

    this.emit(NOTIFICATION, obj._id);
  }

  async signUpUser(useRecaptcha, recaptchaResponse, email, password, name) {
    try {
      if (useRecaptcha) {
        const isRecaptchaValid = await validateRecaptchaResponse(
          this._config.RECAPTCHA_SECRET_KEY,
          recaptchaResponse,
        );

        if (!isRecaptchaValid)
          throw new ApolloError(
            'Submited reCaptcha response is not valid',
            'INVALID_CAPTCHA',
          );
      }

      const user = new User({
        email,
        password,
        name,
      });

      const createdUser = await user.save();

      this.notifyUser(createdUser._id, VERIFY_EMAIL, {
        email: createdUser.email,
      });

      return createdUser;
    } catch (e) {
      if (e.name === 'ValidationError') {
        const validationErrors = {};

        Object.entries(e.errors).forEach(([key, value]) => {
          validationErrors[key] = value.message;
        });

        return new UserInputError(
          'Failed to sign up due to validation errors',
          { validationErrors },
        );
      }

      return e;
    }
  }

  async signInUser(email, password) {
    const doc = await this._getUser({ email, password }, { mustExist: true });

    this._log.info(`Updating login timestamp for user ${doc.user._id} ...`);

    await doc.update({
      lastLogin: Date.now(),
    });

    return this.getUserProfile(doc.user._id, true);
  }

  async getUserProfile(userAddress, canViewPrivateFields = false) {
    const doc = await this._getUser(userAddress);

    if (!doc.exists) {
      return {};
    }

    const {
      address,
      social,
      legal,
      created,
      lastLogin,
      email,
      realName,
      username,
    } = doc.data;

    return {
      address,
      username,
      created,
      lastLogin,
      social: Object.keys(social || {}).reduce((m, type) => {
        m.push({
          type,
          value: social[type],
        });

        return m;
      }, []),
      ...(canViewPrivateFields ? { email, legal, realName } : {}),
    };
  }
}

module.exports = async ({ config, log }) => {
  const nativeDb = await setupDb({ config, log });

  return new Db({ config, nativeDb, log });
};
