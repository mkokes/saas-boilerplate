const EventEmitter = require('eventemitter3');
const jwt = require('jsonwebtoken');
const otplib = require('otplib');
const authenticator = require('otplib/authenticator');
const moment = require('moment');
const uuidv4 = require('uuid/v4');

const {
  NOTIFICATION,
  MAILCHIMP,
  MIXPANEL_EVENT,
} = require('../constants/events');
const { MARKETING_INFO } = require('../constants/legal');
const {
  VERIFY_EMAIL,
  WELCOME,
  FORGOT_PASSWORD,
  PASSWORD_RESETED,
  PASSWORD_CHANGED,
  EMAIL_CHANGED,
  ENABLED_2FA,
  DISABLED_2FA,
  SUPPORT_REQUEST,
  SUPPORT_REQUEST_USER_CONFIRMATION,
  TRIAL_EXPIRING,
  TRIAL_EXPIRED,
  SUBSCRIPTION_STARTED,
  SUBSCRIPTION_ENDED,
  SUBSCRIPTION_RENEWAL_CANCELLED,
  PAYMENT_RECEIVED,
} = require('../constants/notifications');

const setupDb = require('./setup');
const Users = require('./models/users');
const Plans = require('./models/plans');
const Subscriptions = require('./models/subscriptions');
const Payments = require('./models/payments');
const Notifications = require('./models/notifications');
const ResetPasswordTokens = require('./models/resetPasswordTokens');
const SupportTickets = require('./models/supportTickets');

class Db extends EventEmitter {
  constructor({ config, nativeDb, log: parentLog }) {
    super();
    this._config = config;
    this._nativeDb = nativeDb;
    this._log = parentLog.create('db/core');
  }

  async _getUser(userId, { mustExist = false } = {}) {
    const user = await Users.findOne({ _id: userId }).exec();

    if (mustExist && !user) {
      throw new Error(`user not found: ${userId}`);
    }

    return user;
  }

  async getUserByEmail(email) {
    return Users.findOne({ email }).exec();
  }

  async getUserById(id) {
    return Users.findById(id).exec();
  }

  async getUsersInTrialPeriod() {
    const trialPlan = await Plans.findOne({ name: 'TRIAL' }).exec();

    return Subscriptions.find({
      _plan: trialPlan._id,
      status: 'active',
    }).exec();
  }

  async getActiveSubscriptionsWithNoPaymentMethod() {
    return Subscriptions.find({
      status: 'active',
      paymentStatus: 'deleted',
    })
      .populate('_user', '_id')
      .exec();
  }

  async getUserProfile(userId, canViewPrivateFields = false) {
    const user = await this._getUser(userId);

    if (!user) {
      return {};
    }

    const {
      _id,
      _subscription,
      lastLoginAt,
      signupAt,
      email,
      firstName,
      lastName,
      nickname,
      avatar,
      isSignUpEmailConfirmed,
      isTwoFactorAuthenticationEnabled,
      apiSecretKey,
      timezone,
      legal,
    } = user;

    /* eslint-disable */
    return {
      _id: _id.toString(),
      nickname,
      avatar,
      firstName,
      lastName,
      _subscription: _subscription ? _subscription.toString() : null,
      email,
      lastLoginAt,
      signupAt,
      isSignUpEmailConfirmed,
      isTwoFactorAuthenticationEnabled,
      timezone,
      legal,
      ...(canViewPrivateFields
        ? {
            apiSecretKey,
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

    const subscription = await Subscriptions.findById(
      user._subscription,
    ).exec();

    return subscription;
  }

  async getUserSubscriptionPlan(userId) {
    const user = await this.getUserById(userId);

    if (!user._subscription) {
      return null;
    }

    await user
      .populate({ path: '_subscription', populate: { path: '_plan' } })
      .execPopulate();

    return user._subscription._plan;
  }

  async getUserPayments(userId) {
    const payments = await Payments.find({ _user: userId }).sort({
      receivedAt: -1,
    });

    return payments;
  }

  async getActivePlans() {
    const _plans = await Plans.find({ internal: false, status: 'active' }).sort(
      {
        tier: 0,
      },
    );

    const plans = _plans.map(obj => {
      const plan = obj.toObject();
      plan._id = plan._id.toString();

      return plan;
    });

    return plans;
  }

  async existsUserWithEmail(email) {
    const count = await Users.countDocuments({ email }).exec();

    return !!count;
  }

  async compareUserPassword(userId, password) {
    const user = await this._getUser(userId, true);

    return user.comparePassword(password);
  }

  async signUpUser(
    email,
    password,
    firstName,
    lastName,
    timezone,
    signupSource,
    signupIP,
    signupCity,
    signupCountry,
  ) {
    const fullNameInitials = `${firstName
      .charAt(0)
      .toUpperCase()} ${lastName.charAt(0).toUpperCase()}`
      .split(/\s/)
      // eslint-disable-next-line no-return-assign, no-param-reassign
      .reduce((response, word) => (response += word.slice(0, 1)), '');

    let nickname = fullNameInitials;
    if (nickname.length > 16) {
      nickname = `${nickname.substr(0, 13)}…`;
    }

    let trialDaysLength;
    switch (signupSource) {
      /* case 'facebook':
        trialDaysLength = 30;
        break; */
      default:
        trialDaysLength = this._config.TRIAL_PERIOD_DAYS;
        break;
    }

    const user = await new Users({
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
      signupSource,
      signupIP: signupIP || null,
      signupCity: signupCity || null,
      signupCountry: signupCountry || null,
    }).save();

    const trialPlan = await Plans.findOne({ name: 'TRIAL' }).select('_id');
    const trialPeriodEndsAt = moment().add(trialDaysLength, 'days');
    const subscription = await new Subscriptions({
      _user: user._id,
      _plan: trialPlan._id,
      servicePeriodEnd: trialPeriodEndsAt,
    }).save();

    user._subscription = subscription._id;
    await user.save();

    this.notifyUser(user._id, VERIFY_EMAIL, {
      action_url: `${this._config.PRODUCT_APP_URL}/confirm-email?token=${
        user.emailConfirmationToken
      }`,
    });

    this._log.info(`user ${user._id} signed up`);

    this.emit(MIXPANEL_EVENT, {
      eventType: 'PEOPLE_SET_ONCE',
      args: [
        user._id,
        {
          internal_id: user._id,
          $created: new Date(),
        },
        {
          $ip: signupIP,
        },
      ],
    });
    this.emit(MIXPANEL_EVENT, {
      eventType: 'PEOPLE_SET',
      args: [
        user._id,
        {
          $email: user.email,
          $first_name: user.firstName,
          $last_name: user.lastName,
          subscribed_plan_id: null,
          trialing: true,
        },
      ],
    });
    this.emit(MIXPANEL_EVENT, {
      eventType: 'TRACK',
      args: [
        'sign up',
        {
          distinct_id: user._id,
        },
      ],
    });

    return user;
  }

  async loginUser(userId) {
    const user = await this._getUser(userId, { mustExist: true });

    user.lastLoginAt = Date.now();
    user.save();

    return this.getUserProfile(userId, false);
  }

  async authChallenge(userId, JWTiat) {
    const user = await this._getUser(userId, { mustExist: true });
    const { passwordUpdatedAt } = user;

    if (user.accountStatus !== 'active') {
      throw new Error('user account status is not active');
    }
    if (JWTiat < (new Date(passwordUpdatedAt).getTime() / 1000).toFixed(0)) {
      throw new Error('token iat must be greater than passwordUpdatedAt');
    }

    return true;
  }

  async forgotPasswordRequest(userId) {
    const user = await this._getUser(userId);

    const resetPasswordToken = await new ResetPasswordTokens({
      _user: user._id,
    }).save();

    this.notifyUser(user._id, FORGOT_PASSWORD, {
      action_url: `${this._config.PRODUCT_APP_URL}/auth/reset-password?token=${
        resetPasswordToken.token
      }`,
    });

    this._log.info(`user ${userId} requested password reset`);
  }

  async resetPasswordRequest(resetToken, newPassword) {
    const resetPasswordToken = await ResetPasswordTokens.findOne({
      token: resetToken,
    })
      .populate('_user', '_id password')
      .exec();

    if (!resetPasswordToken) {
      throw new Error('INVALID_PASSWORD_RESET_TOKEN');
    }

    const { _user, used, createdAt } = resetPasswordToken;

    if (used || createdAt < Date.now() - 60 * 60 * 1000) {
      throw new Error('INVALID_PASSWORD_RESET_TOKEN');
    }

    _user.password = newPassword;

    resetPasswordToken.used = true;
    resetPasswordToken.usedAt = Date.now();

    await _user.save();
    await resetPasswordToken.save();

    this.notifyUser(_user._id, PASSWORD_RESETED);

    this._log.info(`user ${_user._id} reseted account password`);

    this.emit(MIXPANEL_EVENT, {
      eventType: 'TRACK',
      args: [
        'account password reseted',
        {
          distinct_id: _user._id,
        },
      ],
    });
  }

  async confirmUserEmail(confirmationToken) {
    const user = await Users.findOne({
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
        this._log.info(`user ${user._id} confirmed signup email`);

        this.notifyUser(user._id, WELCOME);

        this.emit(MAILCHIMP, { user, actionType: 'ADD' });
        this.emit(MIXPANEL_EVENT, {
          eventType: 'TRACK',
          args: [
            'account email verification',
            {
              distinct_id: user._id,
              email: user.email,
            },
          ],
        });
        break;
      case 'change':
        this.notifyUser(user._id, EMAIL_CHANGED, {
          old_email: oldUserEmail,
        });

        this._log.info(`user ${user._id} confirmed email change`);

        this.emit(MAILCHIMP, {
          user,
          actionType: 'EMAIL_CHANGE',
          oldEmail: oldUserEmail,
        });
        this.emit(MIXPANEL_EVENT, {
          eventType: 'TRACK',
          args: [
            'account email change',
            {
              distinct_id: user._id,
              old: oldUserEmail,
              new: user.email,
            },
          ],
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

    this._log.info(`user ${userId} changed account password`);

    this.notifyUser(user._id, PASSWORD_CHANGED);
    this.emit(MIXPANEL_EVENT, {
      eventType: 'TRACK',
      args: [
        'account password change',
        {
          distinct_id: user._id,
        },
      ],
    });
  }

  async changeUserEmail(userId, candidateEmail) {
    const user = await this._getUser(userId, true);

    user.emailConfirmationToken = jwt.sign(
      {
        type: 'change',
        candidateEmail,
      },
      this._config.JWT_SECRET,
    );
    await user.save();

    this._log.info(`user ${userId} requested email change`);

    this.notifyUser(user._id, VERIFY_EMAIL, {
      action_url: `${this._config.PRODUCT_APP_URL}/confirm-email?token=${
        user.emailConfirmationToken
      }`,
      candidateEmail,
    });
  }

  async updateUserProfile(userId, profile) {
    const { nickname } = profile;

    const user = await this._getUser(userId, { mustExist: true });
    const { nickname: existingNickname } = user;

    user.nickname = nickname || existingNickname;
    await user.save();

    this._log.info(`user ${userId} updated account profile`);

    return this.getUserProfile(userId, false);
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

    this._log.info(`user ${userId} updated account personal details`);

    this.emit(MAILCHIMP, {
      user,
      actionType: 'UPDATE_MERGE_FIELDS',
    });
    this.emit(MIXPANEL_EVENT, {
      eventType: 'PEOPLE_SET',
      args: [
        user._id,
        {
          $first_name: finalFirstName,
          $last_name: finalLastName,
        },
      ],
    });

    return this.getUserProfile(userId, false);
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

    this._log.info(`user ${userId} updated account notifications preferences`);

    const wasMarketingInfoAceptedBefore = existingLegal.find(
      e => e.type === MARKETING_INFO,
    );
    const isMarketingInfoCurrentlyAcceptedNow = finalLegal.find(
      e => e.type === MARKETING_INFO,
    );
    if (wasMarketingInfoAceptedBefore !== isMarketingInfoCurrentlyAcceptedNow) {
      const mailchimpSubscriptionStatus = isMarketingInfoCurrentlyAcceptedNow
        ? 'subscribed'
        : 'unsubscribed';
      this.emit(MAILCHIMP, {
        user,
        actionType: 'STATUS_CHANGE',
        status: mailchimpSubscriptionStatus,
      });
    }

    return this.getUserProfile(userId, false);
  }

  async updateUserPreferences(userId, preferences) {
    const { timezone } = preferences;

    const user = await this._getUser(userId, { mustExist: true });

    user.timezone = timezone;

    await user.save();

    this._log.info(`user ${userId} updated account preferences`);

    return this.getUserProfile(userId, false);
  }

  async generate2FAUser(userId) {
    const user = await this._getUser(userId, { mustExist: true });

    if (user.isTwoFactorAuthenticationEnabled) {
      throw new Error('2FA_ALREADY_ENABLED');
    }

    const secret = authenticator.generateSecret();

    user.twoFactorAuthenticationSecret = secret;
    await user.save();

    this._log.info(`user ${userId} generated new 2FA secret`);

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

    this._log.info(`user ${userId} enabled 2FA`);

    this.notifyUser(user._id, ENABLED_2FA);
    this.emit(MIXPANEL_EVENT, {
      eventType: 'TRACK',
      args: [
        'enable 2fa',
        {
          distinct_id: user._id,
        },
      ],
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

    this._log.info(`user ${userId} disabled 2FA`);

    this.notifyUser(user._id, DISABLED_2FA);
    this.emit(MIXPANEL_EVENT, {
      eventType: 'TRACK',
      args: [
        'disable 2fa',
        {
          distinct_id: user._id,
        },
      ],
    });
  }

  async getPlanById(planId) {
    return Plans.findById(planId).exec();
  }

  async getPlanIdByPaddleId(paddlePlanId) {
    return Plans.findOne({ _paddleProductId: paddlePlanId }).select('_id');
  }

  async getSubscriptionByPaddleId(paddleSubscriptionId) {
    return Subscriptions.findOne({
      _paddleSubscriptionId: paddleSubscriptionId,
    }).select('_id');
  }

  async createSubscription(userId, data) {
    const {
      _plan,
      _user,
      _paddleSubscriptionId,
      _paddlePlanId,
      _paddleCheckoutId,
      price,
      currency,
      _paddleUpdateURL,
      _paddleCancelURL,
      nextBillDateAt,
      servicePeriodEnd,
      paymentMethod,
      paymentStatus,
    } = data;

    // cancel previous user subscription if there's any
    await Subscriptions.updateOne(
      { _user: userId, status: 'active' },
      {
        status: 'cancelled',
        cancelledAt: Date.now(),
      },
    ).exec();

    const subscription = await new Subscriptions({
      _plan,
      _user,
      _paddleSubscriptionId,
      _paddlePlanId,
      _paddleCheckoutId,
      price,
      currency,
      _paddleUpdateURL,
      _paddleCancelURL,
      nextBillDateAt,
      servicePeriodEnd,
      paymentMethod,
      paymentStatus,
    }).save();

    const user = await Users.findByIdAndUpdate(userId, {
      _subscription: subscription._id,
    }).exec();

    this._log.info(
      `subscription ${subscription._id} created for user ${user._id}`,
    );

    this.notifyUser(user._id, SUBSCRIPTION_STARTED);

    this.emit(MIXPANEL_EVENT, {
      eventType: 'PEOPLE_SET',
      args: [
        userId,
        {
          subscribed_plan_id: data._plan,
          trialing: false,
        },
      ],
    });
    this.emit(MIXPANEL_EVENT, {
      eventType: 'TRACK',
      args: [
        'subscribed to a plan',
        {
          distinct_id: userId,
          plan_id: data._plan,
        },
      ],
    });
    this.emit(MAILCHIMP, {
      user,
      actionType: 'UPDATE_TAGS',
      tags: [
        {
          name: 'paying_subscription',
          status: 'active',
        },
      ],
    });
  }

  async subscriptionPaymentPastDue(subscriptionId) {
    const subscription = await Subscriptions.findByIdAndUpdate(subscriptionId, {
      paymentStatus: 'past_due',
      paymentPastDueAt: Date.now(),
    }).exec();

    this._log.info(
      `subscription ${subscriptionId} payment past due user ${
        subscription._user
      }`,
    );

    this.emit(MIXPANEL_EVENT, {
      eventType: 'TRACK',
      args: [
        'subscription payment due',
        {
          distinct_id: subscription._user,
          plan_id: subscription._plan,
        },
      ],
    });

    return subscription;
  }

  async subscriptionUpdated(id, data) {
    const {
      _plan,
      _paddlePlanId,
      _paddleCheckoutId,
      _paddleUpdateURL,
      _paddleCancelURL,
      price,
      nextBillDateAt,
      oldSubscriptionPlanId,
    } = data;

    const subscription = await Subscriptions.findByIdAndUpdate(id, {
      status: 'active',
      _plan,
      _paddlePlanId,
      _paddleCheckoutId,
      _paddleUpdateURL,
      _paddleCancelURL,
      price,
      nextBillDateAt,
      servicePeriodEnd: nextBillDateAt,
    }).exec();

    this._log.info(
      `subscription ${subscription._id} updated user ${subscription._user}`,
    );

    // handle plan upgrade or downgrade
    if (_plan !== oldSubscriptionPlanId) {
      this.emit(MIXPANEL_EVENT, {
        eventType: 'TRACK',
        args: [
          'subscription plan change',
          {
            distinct_id: subscription._user,
            old_plan_id: subscription._plan,
            new_plan_id: _plan,
          },
        ],
      });
      this.emit(MIXPANEL_EVENT, {
        eventType: 'PEOPLE_SET',
        args: [
          subscription._user,
          {
            subscribed_plan_id: _plan,
          },
          {
            $ignore_time: true,
          },
        ],
      });
    }

    this.emit(MIXPANEL_EVENT, {
      eventType: 'TRACK',
      args: [
        'subscription was updated',
        {
          distinct_id: subscription._user,
        },
      ],
    });
  }

  async cancelSubscription(subscriptionId) {
    const subscription = await Subscriptions.findByIdAndUpdate(subscriptionId, {
      status: 'cancelled',
      cancelledAt: Date.now(),
    })
      .populate('_user', '_id email')
      .exec();

    const { _user } = subscription;

    await Users.updateOne(
      { _id: _user._id },
      {
        _subscription: null,
      },
    ).exec();
    this._log.info(
      `subscription ${subscriptionId} cancelled user ${_user._id}`,
    );

    this.emit(MAILCHIMP, {
      user: _user,
      actionType: 'UPDATE_TAGS',
      tags: [
        {
          name: 'paying_subscription',
          status: 'inactive',
        },
      ],
    });
    this.emit(MIXPANEL_EVENT, {
      eventType: 'PEOPLE_SET',
      args: [
        _user._id,
        {
          subscribed_plan_id: null,
        },
        {
          $ignore_time: true,
        },
      ],
    });
    this.emit(MIXPANEL_EVENT, {
      eventType: 'TRACK',
      args: [
        'cancelled subscription plan',
        {
          distinct_id: _user._id,
          plan_id: subscription._plan,
        },
      ],
    });

    this.notifyUser(_user._id, SUBSCRIPTION_ENDED);
  }

  async cancelSubscriptionPaymentMethod(paddleSubscriptionId) {
    const subscription = await Subscriptions.findOneAndUpdate(
      {
        _paddleSubscriptionId: paddleSubscriptionId,
      },
      {
        paymentStatus: 'deleted',
        paymentCancelledAt: Date.now(),
      },
    )
      .populate('_user', '_id email')
      .exec();
    const { _user } = subscription;
    this._log.info(
      `subscription ${subscription._id} renewal cancelled user ${_user._id}`,
    );

    this.notifyUser(_user._id, SUBSCRIPTION_RENEWAL_CANCELLED);

    this.emit(MIXPANEL_EVENT, {
      eventType: 'TRACK',
      args: [
        'cancelled subscription payment',
        {
          distinct_id: _user._id,
          plan_id: subscription._plan,
        },
      ],
    });
  }

  async subscriptionPaymentReceived(data) {
    const {
      _user,
      _plan,
      _paddleSubscriptionId,
      _paddlePlanId,
      _paddleOrderId,
      _paddleCheckoutId,
      _paddleUserId,
      saleGross,
      feeAmount,
      earnings,
      taxAmount,
      paymentMethod,
      coupon,
      customerName,
      customerCountry,
      currency,
      _paddleReceiptURL,
    } = data;

    const payment = await new Payments({
      _user,
      _plan,
      _paddleSubscriptionId,
      _paddlePlanId,
      _paddleOrderId,
      _paddleCheckoutId,
      _paddleUserId,
      saleGross,
      feeAmount,
      earnings,
      taxAmount,
      paymentMethod,
      coupon,
      customerName,
      customerCountry,
      currency,
      _paddleReceiptURL,
    }).save();

    this._log.info(
      `payment received #${payment._id} +$${earnings} from user ${_user}`,
    );

    this.emit(MIXPANEL_EVENT, {
      eventType: 'PEOPLE_TRACK_CHARGE',
      args: [data._user, data.saleGross],
    });
    this.emit(MIXPANEL_EVENT, {
      eventType: 'TRACK',
      args: [
        'subscription payment made',
        {
          distinct_id: data._user,
          payment_id: payment._id,
          plan_id: data._plan,
          amount: data.saleGross,
          method: data.paymentMethod,
          coupon: data.coupon,
        },
      ],
    });

    return payment;
  }

  async subscriptionPaymentRefunded(paddleOrderId, data) {
    const {
      refundType,
      saleGrossRefund,
      feeRefund,
      taxRefund,
      earningsDecreased,
    } = data;

    const payment = Payments.findOneAndUpdate(
      {
        _paddleOrderId: paddleOrderId,
      },
      {
        status: 'refunded',
        refundedAt: Date.now(),
        saleGrossRefund,
        feeRefund,
        taxRefund,
        earningsDecreased,
        refundType,
      },
    ).exec();

    this._log.info(
      `payment refunded #${payment._id} -$${saleGrossRefund} for user ${
        payment._user
      }`,
    );

    this.emit(MIXPANEL_EVENT, {
      eventType: 'TRACK',
      args: [
        'subscription payment refunded',
        {
          distinct_id: payment._user,
          payment_id: payment._id,
          plan_id: payment._plan,
          amount: payment.saleGrossRefund,
        },
      ],
    });

    return payment;
  }

  async contactSupport(
    userId,
    requesterName,
    requesterEmail,
    subject,
    ticketType,
    description,
  ) {
    const supportTicket = await new SupportTickets({
      _user: userId,
      requesterName,
      requesterEmail,
      subject,
      type: ticketType,
      description,
    }).save();

    const targetUserId = userId || null;

    this.notifyUser(targetUserId, SUPPORT_REQUEST, {
      ticket_id: supportTicket._ticketId,
      requester_name: requesterName,
      requester_email: requesterEmail,
      ticket_subject: subject,
      ticket_type: ticketType,
      ticket_description: description,
    });
    this.notifyUser(targetUserId, SUPPORT_REQUEST_USER_CONFIRMATION, {
      ticket_id: supportTicket._ticketId,
      requester_email: requesterEmail,
      ticket_subject: subject,
      ticket_description: description,
    });

    if (targetUserId) {
      this._log.info(`user ${targetUserId} submitted a support ticket`);
    }
  }

  async isUserTrialExpiringWarningSent(userId) {
    return Boolean(
      await Notifications.countDocuments({
        _user: userId,
        type: TRIAL_EXPIRING,
      }).exec(),
    );
  }

  async sendUserTrialExpiringWarning(userId) {
    this.notifyUser(userId, TRIAL_EXPIRING);

    this._log.info(`trial warning sent for user ${userId}`);
  }

  async userTrialExpired(userId) {
    await Subscriptions.updateOne(
      { _user: userId, status: 'active' },
      {
        status: 'cancelled',
        cancelledAt: Date.now(),
      },
    ).exec();
    await Users.updateOne({ _id: userId }, { _subscription: null }).exec();

    this._log.info(`trial expired for user ${userId}`);

    this.emit(MIXPANEL_EVENT, {
      eventType: 'PEOPLE_SET',
      args: [
        userId,
        {
          trialing: false,
        },
      ],
    });

    this.notifyUser(userId, TRIAL_EXPIRED);
  }

  async regenerateUserApiSecretKey(userId) {
    const user = await this._getUser(userId, { mustExist: true });

    user.apiSecretKey = uuidv4();
    user.apiRegeneratedAt = Date.now();
    await user.save();

    this._log.info(`user ${user._id} regenerated api secret key`);

    return { apiSecretKey: user.apiSecretKey };
  }

  async cryptoPaymentReceived(data) {
    const { _user, _plan, description, saleGross, earnings } = data;

    const payment = await new Payments({
      _user,
      _plan,
      description,
      saleGross,
      earnings: saleGross,
      paymentMethod: 'cryptocurrency',
    }).save();

    this._log.info(
      `payment received #${payment._id} +$${earnings} from user ${_user._id}`,
    );

    this.notifyUser(_user, PAYMENT_RECEIVED, {
      _shortId: payment._shortId,
      saleGross,
      paymentMethod: 'Cryptocurrency',
      description,
    });

    this.emit(MIXPANEL_EVENT, {
      eventType: 'PEOPLE_TRACK_CHARGE',
      args: [data._user, data.saleGross],
    });
  }

  async notifyUser(userId, type, variables) {
    const notification = await new Notifications({
      _user: userId,
      type,
      variables,
    }).save();

    this.emit(NOTIFICATION, notification);

    return notification;
  }
}

module.exports = async ({ config, log }) => {
  const nativeDb = await setupDb({ config, log });

  return new Db({ config, nativeDb, log });
};
