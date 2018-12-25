const EventEmitter = require('eventemitter3');
const jwt = require('jsonwebtoken');
const otplib = require('otplib');
const authenticator = require('otplib/authenticator');

const setupDb = require('./setup');
const User = require('./models/user');
const Plan = require('./models/plan');
const Subscription = require('./models/subscription');
const Payment = require('./models/payment');
const Notification = require('./models/notification');
const ResetPasswordToken = require('./models/resetPasswordToken');
const { NOTIFICATION } = require('../constants/events');
const { MARKETING_INFO } = require('../constants/legal');
const {
  VERIFY_EMAIL,
  FORGOT_PASSWORD,
  PASSWORD_RESETED,
  PASSWORD_CHANGED,
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

  async getUserById(id) {
    return User.findById({ id }).exec();
  }

  async getUserProfile(userId, canViewPrivateFields = false) {
    const user = await this._getUser(userId);

    if (!user) {
      return {};
    }

    const {
      _id,
      lastLoginAt,
      registeredAt,
      email,
      fullName,
      nickname,
      avatar,
      isSignUpEmailConfirmed,
      isTwoFactorAuthenticationEnabled,
      isInTrialPeriod,
      trialPeriodStartedAt,
      legal,
    } = user;

    /* eslint-disable */
    return {
      nickname,
      avatar,
      ...(canViewPrivateFields
        ? {
            _id: _id.toString(),
            fullName,
            email,
            lastLoginAt,
            registeredAt,
            isSignUpEmailConfirmed,
            isTwoFactorAuthenticationEnabled,
            isInTrialPeriod,
            trialPeriodStartedAt,
            legal,
          }
        : {}),
    };
    /* eslint-enable */
  }

  async getUserSubscription(userId) {
    const user = await this._getUser(userId);

    if (!user) {
      return {};
    }

    await user.populate('_subscription').execPopulate();

    return user._subscription;
  }

  async existsUserWithEmail(email) {
    const count = await User.countDocuments({ email }).exec();

    return !!count;
  }

  async compareUserPassword(userId, password) {
    const user = await this._getUser(userId, true);

    return user.comparePassword(password);
  }

  async signUpUser(email, password, fullName) {
    let fullNameInitials = fullName.match(/\b\w/g) || [];
    fullNameInitials = (
      (fullNameInitials.shift() || '') + (fullNameInitials.pop() || '')
    ).toUpperCase();

    let defaultNickname =
      fullNameInitials.length > 1 ? fullNameInitials : fullName;
    if (defaultNickname.length > 16) {
      defaultNickname = `${defaultNickname.substr(0, 13)}…`;
    }

    const user = await new User({
      email,
      password,
      fullName,
      nickname: defaultNickname,
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

  async authChallenge(userId, JWTiat) {
    const user = await this._getUser(userId, { mustExist: true });
    const { passwordUpdatedAt, accountStatus } = user;

    if (JWTiat < (new Date(passwordUpdatedAt).getTime() / 1000).toFixed(0)) {
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
    resetPasswordToken.usedAt = Date.now;

    await _user.save();
    await resetPasswordToken.save();

    this.notify(_user._id, PASSWORD_RESETED, {
      email: _user.email,
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

    user.confirmationToken = null;
    user.emailConfirmedAt = Date.now;
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

    this.notify(user._id, PASSWORD_CHANGED, {
      email: user.email,
    });
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

  async updateUserProfile(userId, profile) {
    const { nickname } = profile;

    const user = await this._getUser(userId, { mustExist: true });
    const { nickname: existingNickname } = user;

    user.nickname = nickname || existingNickname;
    await user.save();

    return this.getUserProfile(userId, true);
  }

  async updateUserPersonalDetails(userId, profile) {
    const { fullName } = profile;

    const user = await this._getUser(userId, { mustExist: true });
    const { fullName: existingFullName } = user;

    const finalFullName = fullName || existingFullName;

    user.fullName = finalFullName;
    await user.save();

    return this.getUserProfile(userId, true);
  }

  async updateUserNotificationsPreferences(userId, notifications) {
    const NOTIFICATIONS_KEYS = [MARKETING_INFO];

    const user = await this._getUser(userId, { mustExist: true });

    const { legal: existingLegal } = user;

    const existingLegalFiltered = existingLegal.filter(value => {
      if (value.type.includes(NOTIFICATIONS_KEYS)) return false;

      return true;
    });

    const finalLegal = existingLegalFiltered.concat(notifications);
    user.legal = finalLegal;

    await user.save();

    return this.getUserProfile(userId, true);
  }

  async generate2FAUser(userId) {
    const user = await this._getUser(userId, { mustExist: true });

    const secret = authenticator.generateSecret();

    user.twoFactorAuthenticationSecret = secret;
    await user.save();

    return {
      secret,
      qrcode: otplib.authenticator.keyuri(
        user.email,
        'MY_SERVICE_NAME',
        secret,
      ),
    };
  }

  async check2FAUser(userId, token) {
    const user = await this._getUser(userId, { mustExist: true });

    const isValid = otplib.authenticator.check(
      token,
      user.twoFactorAuthenticationSecret,
    );
    if (!isValid) {
      return false;
    }

    return true;
  }

  async confirmEnable2FAUser(userId, token) {
    const user = await this._getUser(userId, { mustExist: true });

    const isValid = otplib.authenticator.check(
      token,
      user.twoFactorAuthenticationSecret,
    );
    if (!isValid) {
      throw new Error('INVALID_TOKEN');
    }

    user.isTwoFactorAuthenticationEnabled = true;
    await user.save();
  }

  async disable2FA(userId, token) {
    const user = await this._getUser(userId, { mustExist: true });

    const isValid = otplib.authenticator.check(
      token,
      user.twoFactorAuthenticationSecret,
    );
    if (!isValid) {
      throw new Error('INVALID_TOKEN');
    }

    user.isTwoFactorAuthenticationEnabled = false;
    user.twoFactorAuthenticationSecret = null;
    await user.save();
  }

  async getPlanIdByPaddleId(paddlePlanId) {
    return Plan.findOne({ _paddleProductId: paddlePlanId }).select('_id');
  }

  async getSubscriptionByPaddleId(paddleSubscriptionId) {
    return Subscription.findOne({
      _paddleSubscriptionId: paddleSubscriptionId,
    }).select('_id');
  }

  async createSubscription(data) {
    return new Subscription({
      ...data,
    }).save();
  }

  async subscriptionPastDue(id) {
    return Subscription.findByIdAndUpdate(id, {
      status: 'past_due',
      pastDueAt: Date.now,
    });
  }

  async subscriptionUpdated(id, data) {
    return Subscription.findByIdAndUpdate(id, {
      status: 'active',
      lastUpdatedAt: Date.now,
      ...data,
    });
  }

  async cancelSubscription(paddleSubscriptionId) {
    return Subscription.findOneAndUpdate(
      {
        _paddleSubscriptionId: paddleSubscriptionId,
      },
      {
        status: 'deleted',
        cancelledAt: Date.now,
      },
    );
  }

  async receivedSubscriptionPayment(data) {
    return new Payment({
      ...data,
    }).save();
  }

  async SubscriptionPaymentRefunded(paddleOrderId, data) {
    return Payment.findOneAndUpdate(
      {
        _paddleOrderId: paddleOrderId,
      },
      {
        status: 'refunded',
        refundedAt: Date.now,
        ...data,
      },
    );
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
