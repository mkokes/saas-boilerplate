const EventEmitter = require('eventemitter3');

const setupDb = require('./setup');
const User = require('./models/user');
const Notification = require('./models/notification');
const ResetPasswordToken = require('./models/resetPasswordToken');
const { NOTIFICATION } = require('../constants/events');
const {
  VERIFY_EMAIL,
  FORGOT_PASSWORD,
  PASSWORD_RESETED,
  WELCOME_EMAIL,
} = require('../constants/notifications');

class Db extends EventEmitter {
  constructor({ config, nativeDb, log: parentLog }) {
    super();
    this._config = config;
    this._nativeDb = nativeDb;
    this._log = parentLog.create('db/core');
  }

  async _getUser(userId, { mustExist = false } = {}) {
    const user = await User.findOne({ _id: userId }).exec();

    if (mustExist && !user) {
      throw new Error(`User not found: ${userId}`);
    }

    return user;
  }

  async getUserByEmail(email) {
    return User.findOne({ email }).exec();
  }

  async getUserProfile(userId, canViewPrivateFields = false) {
    const user = await this._getUser(userId);

    if (!user) {
      return {};
    }

    const {
      lastLoginAt,
      registeredAt,
      email,
      fullName,
      username,
      avatar,
      isEmailConfirmed,
    } = user;

    return {
      lastLoginAt,
      registeredAt,
      ...(canViewPrivateFields
        ? { fullName, username, email, avatar, isEmailConfirmed }
        : {}),
    };
  }

  async signUpUser(email, password, fullName, username) {
    const user = await new User({
      email,
      password,
      fullName,
      username,
    }).save();

    this.notify(user._id, VERIFY_EMAIL, {
      email: user.email,
    });

    return user;
  }

  async loginUser(userId) {
    const user = await this._getUser(userId, { mustExist: true });

    this._log.info(`Updating login timestamp for user ${userId}`);
    user.lastLoginAt = Date.now();
    await user.save();

    return this.getUserProfile(userId, true);
  }

  async loginChallenge(userId, tokenPasswordHash) {
    const user = await this._getUser(userId, { mustExist: true });

    if (user.accountStatus !== 'active') {
      return false;
    }
    // https://stackoverflow.com/questions/21978658/invalidating-json-web-tokens#comment45057142_23089839
    if (user.password !== tokenPasswordHash) {
      return false;
    }

    return true;
  }

  async forgotPasswordRequest(userId) {
    const user = await this._getUser(userId);

    const resetPasswordToken = await new ResetPasswordToken({
      _user: user._id,
    }).save();

    this.notify(user._id, FORGOT_PASSWORD, {
      email: user.email,
      resetToken: resetPasswordToken.token,
    });
  }

  async resetPasswordRequest(resetToken, newPassword) {
    const resetPasswordToken = await ResetPasswordToken.findOne({
      token: resetToken,
    })
      .populate('_user', '_id password')
      .exec();

    if (!resetPasswordToken) {
      throw new Error('INVALID_PASSWORD_RESET_TOKEN');
    }

    const { _user, used, createdAt } = resetPasswordToken;

    if (used || createdAt < Date.now() - 5 * 60 * 1000) {
      throw new Error('INVALID_PASSWORD_RESET_TOKEN');
    }

    _user.password = newPassword;

    resetPasswordToken.used = true;
    resetPasswordToken.usedAt = Date.now();

    await _user.save();
    await resetPasswordToken.save();

    this.notify(_user._id, PASSWORD_RESETED, {
      email: _user.email,
      resetToken: resetPasswordToken.token,
    });
  }

  async confirmUserEmail(confirmationToken) {
    const user = await User.findOne({
      isEmailConfirmed: false,
      emailConfirmationToken: confirmationToken,
    }).exec();

    if (!user) {
      throw new Error('INVALID_EMAIL_CONFIRMATION_TOKEN');
    }

    user.isEmailConfirmed = true;
    user.emailConfirmatedAt = Date.now();

    await user.save();

    this.notify(user._id, WELCOME_EMAIL, {
      email: user.email,
    });
  }

  async changeUserPassword(userId, oldPassword, newPassword) {
    console.debug(userId);
    console.debug(oldPassword);
    console.debug(newPassword);
  }

  async notify(userId, type, data) {
    const notification = await new Notification({
      _user: userId,
      type,
      data,
    }).save();

    this.emit(NOTIFICATION, notification._id);
  }
}

module.exports = async ({ config, log }) => {
  const nativeDb = await setupDb({ config, log });

  return new Db({ config, nativeDb, log });
};
