const EventEmitter = require('eventemitter3');
const jwt = require('jsonwebtoken');

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
      isSignUpEmailConfirmed,
    } = user;

    return {
      lastLoginAt,
      registeredAt,
      ...(canViewPrivateFields
        ? { fullName, username, email, avatar, isSignUpEmailConfirmed }
        : {}),
    };
  }

  async existsUserWithEmail(email) {
    const count = await User.countDocuments({ email }).exec();

    return !!count;
  }

  async compareUserPassword(userId, password) {
    const user = await this._getUser(userId, true);

    return user.comparePassword(password);
  }

  async signUpUser(email, password, fullName, username) {
    const user = await new User({
      email,
      password,
      fullName,
      username,
      emailConfirmationToken: jwt.sign(
        {
          type: 'signup',
        },
        this._config.JWT_SECRET,
      ),
    }).save();

    this.notify(user._id, VERIFY_EMAIL, {
      email: user.email,
      token: user.emailConfirmationToken,
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

  async loginChallenge(decodedJWT) {
    const { iat, _id } = decodedJWT;

    const user = await this._getUser(_id, { mustExist: true });
    const { passwordUpdatedAt, accountStatus } = user;

    /* console.log(iat);
    console.log((new Date(passwordUpdatedAt).getTime() / 1000).toFixed(0));
    console.log('---'); */

    if (iat < (new Date(passwordUpdatedAt).getTime() / 1000).toFixed(0)) {
      throw new Error('token iat must be greater than passwordUpdatedAt');
    }
    if (accountStatus !== 'active') {
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
      token: resetPasswordToken.token,
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
      token: resetPasswordToken.token,
    });
  }

  async confirmUserEmail(confirmationToken) {
    const user = await User.findOne({
      emailConfirmationToken: confirmationToken,
    }).exec();

    if (!user) {
      throw new Error('UNABLE_EMAIL_CONFIRMATION');
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(
        user.emailConfirmationToken,
        this._config.JWT_SECRET,
      );
    } catch (e) {
      throw new Error('UNABLE_EMAIL_CONFIRMATION');
    }

    switch (decodedToken.type) {
      case 'signup':
        if (user.isSignUpEmailConfirmed) return;

        user.isSignUpEmailConfirmed = true;
        break;
      case 'change':
        if (await this.existsUserWithEmail(decodedToken.candidateEmail)) {
          throw new Error('CANDIDATE_EMAIL_TAKEN');
        }

        user.email = decodedToken.candidateEmail;
        break;
      default:
        break;
    }

    user.emailConfirmedAt = Date.now();
    await user.save();

    if (decodedToken.type === 'signup') {
      this.notify(user._id, WELCOME_EMAIL, {
        email: user.email,
      });
    }
  }

  async changeUserPassword(userId, oldPassword, newPassword) {
    const user = await this._getUser(userId, true);

    const isOldPasswordValid = await user.comparePassword(oldPassword);
    if (!isOldPasswordValid) {
      throw new Error('INVALID_OLD_PASSWORD');
    }

    user.password = newPassword;
    await user.save();
  }

  async changeUserEmail(userId, newEmail) {
    const user = await this._getUser(userId, true);

    user.emailConfirmationToken = jwt.sign(
      {
        type: 'change',
        candidateEmail: newEmail,
      },
      this._config.JWT_SECRET,
    );
    await user.save();

    this.notify(user._id, VERIFY_EMAIL, {
      email: newEmail,
      token: user.emailConfirmationToken,
    });
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
