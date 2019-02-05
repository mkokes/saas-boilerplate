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
  EMAIL_CHANGED,
  WELCOME_EMAIL,
} = require('../constants/notifications');

class Db extends EventEmitter {
  constructor({ config, nativeDb, log: parentLog, mixpanel }) {
    super();
    this._config = config;
    this._nativeDb = nativeDb;
    this._log = parentLog.create('db/core');
    this._mixpanel = mixpanel;
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
    return User.findById(id).exec();
  }

  async getUserProfile(userId, canViewPrivateFields = false) {
    const user = await this._getUser(userId);

    if (!user) {
      return {};
    }

    const {
      _id,
      _subscription,
      accountStatus,
      lastLoginAt,
      registeredAt,
      email,
      firstName,
      lastName,
      nickname,
      avatar,
      isSignUpEmailConfirmed,
      isTwoFactorAuthenticationEnabled,
      isInTrialPeriod,
      trialPeriodStartedAt,
      timezone,
      legal,
    } = user;

    /* eslint-disable */
    return {
      nickname,
      avatar,
      ...(canViewPrivateFields
        ? {
            _id: _id.toString(),
            _subscription: _subscription ? _subscription.toString() : null,
            accountStatus,
            firstName,
            lastName,
            email,
            lastLoginAt,
            registeredAt,
            isSignUpEmailConfirmed,
            isTwoFactorAuthenticationEnabled,
            isInTrialPeriod,
            trialPeriodStartedAt,
            timezone,
            legal,
          }
        : {}),
    };
    /* eslint-enable */
  }

  async getUserSubscription(userId) {
    const user = await this.getUserById(userId);

    if (!user._subscription) {
      return null;
    }

    await user
      .populate({ path: '_subscription', populate: { path: '_plan' } })
      .execPopulate();

    return user._subscription;
  }

  async getUserPayments(userId) {
    const payments = await Payment.find({ _user: userId }).sort({
      receivedAt: -1,
    });

    return payments;
  }

  async getActiveSubscriptionPlans() {
    const _plans = await Plan.find({ status: 'active' }).sort({
      tier: 0,
      price: 0,
    });

    const plans = _plans.map(obj => {
      const plan = obj.toObject();
      plan._id = plan._id.toString();

      return plan;
    });

    return plans;
  }

  async existsUserWithEmail(email) {
    const count = await User.countDocuments({ email }).exec();

    return !!count;
  }

  async compareUserPassword(userId, password) {
    const user = await this._getUser(userId, true);

    return user.comparePassword(password);
  }

  async signUpUser(email, password, firstName, lastName, timezone) {
    const fullNameInitials = `${firstName} ${lastName}`
      .split(/\s/)
      /* eslint-disable-next-line */
      .reduce((response, word) => (response += word.slice(0, 1)), '');

    let nickname = fullNameInitials.length > 1 ? fullNameInitials : firstName;

    if (nickname.length > 16) {
      nickname = `${nickname.substr(0, 13)}…`;
    }

    const user = await new User({
      email,
      password,
      firstName,
      lastName,
      nickname,
      timezone,
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

    this._mixpanel.people.set_once(user._id, {
      internal_id: user._id,
      $created: new Date(),
    });
    this._mixpanel.people.set(user._id, {
      $email: user.email,
      $first_name: user.firstName,
      $last_name: user.lastName,
      internal_subscribed_plan_id: null,
      trialing: true,
    });
    this._mixpanel.track('sign up', {
      distinct_id: user._id,
    });

    return user;
  }

  async loginUser(userId) {
    const user = await this._getUser(userId, { mustExist: true });

    user.lastLoginAt = Date.now();
    user.save();

    return this.getUserProfile(userId, true);
  }

  async authChallenge(userId, JWTiat) {
    const user = await this._getUser(userId, { mustExist: true });
    const { passwordUpdatedAt } = user;

    if (JWTiat < (new Date(passwordUpdatedAt).getTime() / 1000).toFixed(0)) {
      throw new Error('token iat must be greater than passwordUpdatedAt');
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
    });
    this._mixpanel.track('account password reseted', {
      distinct_id: _user._id,
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

    const oldUserEmail = user.email;

    switch (decodedToken.type) {
      case 'signup':
        if (user.isSignUpEmailConfirmed) {
          throw new Error('SIGNUP_EMAIL_ALREADY_VERIFIED');
        }

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
    user.emailConfirmedAt = Date.now();
    await user.save();

    switch (decodedToken.type) {
      case 'signup':
        this.notify(user._id, WELCOME_EMAIL, {
          email: user.email,
        });
        this._mixpanel.track('account email verification', {
          distinct_id: user._id,
          email: user.email,
        });
        break;
      case 'change':
        this.notify(user._id, EMAIL_CHANGED, {
          email: oldUserEmail,
          newEmail: user.email,
        });
        this._mixpanel.track('account email change', {
          distinct_id: user._id,
          old: oldUserEmail,
          new: user.email,
        });
        break;
      default:
        break;
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
    this._mixpanel.track('account password change', {
      distinct_id: user._id,
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
    const { firstName, lastName } = profile;

    const user = await this._getUser(userId, { mustExist: true });
    const { firstName: existingFirstName, lastName: existingLastName } = user;

    const finalFirstName = firstName || existingFirstName;
    const finalLastName = lastName || existingLastName;

    user.firstName = finalFirstName;
    user.lastName = finalLastName;
    await user.save();

    this._mixpanel.people.set(user._id, {
      $first_name: finalFirstName,
      $last_name: finalLastName,
    });

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

  async updateUserPreferences(userId, preferences) {
    const { timezone } = preferences;

    const user = await this._getUser(userId, { mustExist: true });

    user.timezone = timezone;

    await user.save();

    return this.getUserProfile(userId, true);
  }

  async generate2FAUser(userId) {
    const user = await this._getUser(userId, { mustExist: true });

    if (user.isTwoFactorAuthenticationEnabled) {
      throw new Error('2FA_ALREADY_ENABLED');
    }

    const secret = authenticator.generateSecret();

    user.twoFactorAuthenticationSecret = secret;
    await user.save();

    return {
      secret,
      qrcode: otplib.authenticator.keyuri(
        user.email,
        this._config.GOOGLE_AUTHENTICATOR_DISPLAY_NAME,
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

    if (user.isTwoFactorAuthenticationEnabled) {
      throw new Error('2FA_ALREADY_ENABLED');
    }

    const isValid = otplib.authenticator.check(
      token,
      user.twoFactorAuthenticationSecret,
    );
    if (!isValid) {
      throw new Error('INVALID_TOKEN');
    }

    user.isTwoFactorAuthenticationEnabled = true;
    await user.save();

    this._mixpanel.track('enable 2fa', {
      distinct_id: user._id,
    });
  }

  async disable2FA(userId, token) {
    const user = await this._getUser(userId, { mustExist: true });

    if (!user.isTwoFactorAuthenticationEnabled) {
      throw new Error('2FA_ALREADY_DISABLED');
    }

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

    this._mixpanel.track('disable 2fa', {
      distinct_id: user._id,
    });
  }

  async getPlanById(planId) {
    return Plan.findById(planId).exec();
  }

  async getPlanIdByPaddleId(paddlePlanId) {
    return Plan.findOne({ _paddleProductId: paddlePlanId }).select('_id');
  }

  async getSubscriptionByPaddleId(paddleSubscriptionId) {
    return Subscription.findOne({
      _paddleSubscriptionId: paddleSubscriptionId,
    }).select('_id');
  }

  async createSubscription(userId, data) {
    const subscription = await new Subscription({
      ...data,
    }).save();

    await User.findByIdAndUpdate(userId, {
      _subscription: subscription._id,
      isInTrialPeriod: false, // suspend trial period if user decided to upgrade while trialing
    }).exec();

    this._mixpanel.people.set(userId, {
      internal_subscribed_plan_id: data._plan,
      trialing: false,
    });
    this._mixpanel.track('subscribed to a plan', {
      distinct_id: userId,
      internal_plan_id: data._plan,
    });
  }

  async subscriptionPaymentPastDue(id) {
    const subscription = await Subscription.findByIdAndUpdate(id, {
      paymentStatus: 'past_due',
      pastDueAt: Date.now(),
    }).exec();

    this._mixpanel.track('subscription payment due', {
      distinct_id: subscription._user,
      plan_id: subscription._plan,
    });

    return subscription;
  }

  async subscriptionUpdated(id, data) {
    const subscription = await Subscription.findByIdAndUpdate(id, {
      status: 'active',
      lastUpdatedAt: Date.now(),
      ...data,
    }).exec();

    this._mixpanel.people.set(
      subscription._user,
      {
        internal_subscribed_plan_id: subscription._plan,
      },
      {
        $ignore_time: true,
      },
    );
    this._mixpanel.track('subscription updated', {
      distinct_id: subscription._user,
    });

    return subscription;
  }

  async cancelSubscriptionPayment(paddleSubscriptionId) {
    const subscription = await Subscription.findOneAndUpdate(
      {
        _paddleSubscriptionId: paddleSubscriptionId,
      },
      {
        paymentStatus: 'deleted',
        cancelledAt: Date.now(),
      },
    ).exec();

    this._mixpanel.people.set(
      subscription._user,
      {
        internal_subscribed_plan_id: null,
      },
      {
        $ignore_time: true,
      },
    );
    this._mixpanel.track('cancelled subscription plan', {
      distinct_id: subscription._user,
      internal_plan_id: subscription._plan,
    });
  }

  async receivedSubscriptionPayment(data) {
    const payment = await new Payment({
      ...data,
    }).save();

    this._mixpanel.people.track_charge(data._user, data.saleGross);
    this._mixpanel.track('subscription payment made', {
      distinct_id: data._user,
      internal_payment_id: payment._id,
      internal_plan_id: data._plan,
      amount: data.saleGross,
      method: data.paymentMethod,
      coupon: data.coupon,
    });

    return payment;
  }

  async subscriptionPaymentRefunded(paddleOrderId, data) {
    const payment = Payment.findOneAndUpdate(
      {
        _paddleOrderId: paddleOrderId,
      },
      {
        status: 'refunded',
        refundedAt: Date.now(),
        ...data,
      },
    ).exec();

    this._mixpanel.track('subscription payment refunded', {
      distinct_id: data._user,
      internal_payment_id: payment._user,
      internal_plan_id: payment._plan,
      amount: payment.saleGrossRefund,
    });

    return payment;
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

module.exports = async ({ config, log, mixpanel }) => {
  const nativeDb = await setupDb({ config, log });

  return new Db({ config, nativeDb, log, mixpanel });
};
