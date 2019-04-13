const EventEmitter = require('eventemitter3');
const jwt = require('jsonwebtoken');
const otplib = require('otplib');
const authenticator = require('otplib/authenticator');

const {
  NOTIFICATION,
  MANAGE_MAILCHIMP_LIST,
  MIXPANEL_EVENT,
  CHARTMOGUL,
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
  SUPPORT_REQUEST_CONFIRMATION,
  TRIAL_EXPIRING,
  TRIAL_EXPIRED,
  SUBSCRIPTION_ENDED,
  SUBSCRIPTION_PAYMENT_METHOD_DELETED,
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
    return Users.find({
      accountStatus: 'active',
      isInTrialPeriod: true,
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
      accountStatus,
      lastLoginAt,
      signupAt,
      email,
      firstName,
      lastName,
      nickname,
      avatar,
      isSignUpEmailConfirmed,
      isTwoFactorAuthenticationEnabled,
      isInTrialPeriod,
      trialPeriodEndsAt,
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
            signupAt,
            isSignUpEmailConfirmed,
            isTwoFactorAuthenticationEnabled,
            isInTrialPeriod,
            trialPeriodEndsAt,
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
    const payments = await Payments.find({ _user: userId }).sort({
      receivedAt: -1,
    });

    return payments;
  }

  async getActivePlans() {
    const _plans = await Plans.find({ status: 'active' }).sort({
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
    const fullNameInitials = `${firstName} ${lastName}`
      .split(/\s/)
      /* eslint-disable-next-line */
      .reduce((response, word) => (response += word.slice(0, 1)), '');

    let nickname = fullNameInitials.length > 1 ? fullNameInitials : firstName;

    if (nickname.length > 16) {
      nickname = `${nickname.substr(0, 13)}…`;
    }

    let trialDaysLength;
    switch (signupSource) {
      /* case 'facebook':
        trialDaysLength = 30;
        break; */
      default:
        trialDaysLength = this._config.PRODUCT_TRIAL_DAYS_LENGTH;
        break;
    }

    const trialPeriodEndsAt = new Date();
    trialPeriodEndsAt.setDate(trialPeriodEndsAt.getDate() + trialDaysLength);

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
      trialPeriodEndsAt,
      trialDaysLength,
      signupSource,
      signupIP: signupIP || null,
      signupCity: signupCity || null,
      signupCountry: signupCountry || null,
    }).save();

    this.notifyUser(user._id, VERIFY_EMAIL, {
      action_url: `${this._config.PRODUCT_APP_URL}/confirm-email?token=${
        user.emailConfirmationToken
      }`,
    });

    this.emit(CHARTMOGUL, {
      eventType: 'CREATE_CUSTOMER',
      user,
    });
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

    return this.getUserProfile(userId, true);
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
        this.notifyUser(user._id, WELCOME);

        this.emit(MANAGE_MAILCHIMP_LIST, { user, actionType: 'ADD' });
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
        this.emit(MANAGE_MAILCHIMP_LIST, {
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

    this.emit(MANAGE_MAILCHIMP_LIST, {
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
      this.emit(MANAGE_MAILCHIMP_LIST, {
        user,
        actionType: 'STATUS_CHANGE',
        status: mailchimpSubscriptionStatus,
      });
    }

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
      quantity,
      unitPrice,
      currency,
      updateURL,
      cancelURL,
      nextBillDateAt,

      servicePeriodEnd,
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
      quantity,
      unitPrice,
      currency,
      updateURL,
      cancelURL,
      nextBillDateAt,
      servicePeriodEnd,
    }).save();

    const user = await Users.findByIdAndUpdate(userId, {
      _subscription: subscription._id,
      isInTrialPeriod: false, // suspend trial period if user decided to upgrade while trialing
    }).exec();

    this._log.info(`subscription created for user ${user._id}`);

    this.emit(CHARTMOGUL, {
      eventType: 'CREATE_INVOICE',
      user,
      subscription,
    });
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
    this.emit(MANAGE_MAILCHIMP_LIST, {
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

  async subscriptionPaymentPastDue(id) {
    const subscription = await Subscriptions.findByIdAndUpdate(id, {
      paymentStatus: 'past_due',
      paymentPastDueAt: Date.now(),
    }).exec();

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
      updateURL,
      cancelURL,
      quantity,
      unitPrice,
      nextBillDateAt,
      servicePeriodEnd,
    } = data;

    const _subscription = await Subscriptions.findById(id).exec();

    await Subscriptions.findByIdAndUpdate(id, {
      status: 'active',
      _plan,
      _paddlePlanId,
      _paddleCheckoutId,
      updateURL,
      cancelURL,
      quantity,
      unitPrice,
      nextBillDateAt,
      servicePeriodEnd,
    }).exec();

    this._log.info(`subscription ${_subscription._id} updated`);

    // changed plan (upgrade or downgrade)
    if (_subscription._plan !== _plan) {
      this.emit(MIXPANEL_EVENT, {
        eventType: 'TRACK',
        args: [
          'subscription plan change',
          {
            distinct_id: _subscription._user,
            old_plan_id: _subscription._plan,
            new_plan_id: _plan,
          },
        ],
      });
      this.emit(MIXPANEL_EVENT, {
        eventType: 'PEOPLE_SET',
        args: [
          _subscription._user,
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
        'subscription updated',
        {
          distinct_id: _subscription._user,
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

    this.emit(CHARTMOGUL, {
      eventType: 'CANCE_SUBSCRIPTION',
      subscription,
    });
    this.emit(MANAGE_MAILCHIMP_LIST, {
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

    this.notifyUser(_user._id, SUBSCRIPTION_PAYMENT_METHOD_DELETED);

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
      _subscription,
      _user,
      _plan,
      _paddleSubscriptionId,
      _paddlePlanId,
      _paddleOrderId,
      _paddleCheckoutId,
      _paddleUserId,
      quantity,
      unitPrice,
      saleGross,
      feeAmount,
      earnings,
      taxAmount,
      paymentMethod,
      coupon,
      customerName,
      customerCountry,
      currency,
      receiptURL,
      nextBillDateAt,
    } = data;

    const payment = await new Payments({
      _subscription,
      _user,
      _plan,
      _paddleSubscriptionId,
      _paddlePlanId,
      _paddleOrderId,
      _paddleCheckoutId,
      _paddleUserId,
      quantity,
      unitPrice,
      saleGross,
      feeAmount,
      earnings,
      taxAmount,
      paymentMethod,
      coupon,
      customerName,
      customerCountry,
      currency,
      receiptURL,
      nextBillDateAt,
    }).save();

    this._log.info(`payment received #${payment._id} +$${earnings}`);

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

    this._log.info(`payment refunded #${payment._id} -$${saleGrossRefund}`);

    this.emit(MIXPANEL_EVENT, {
      eventType: 'TRACK',
      args: [
        'subscription payment refunded',
        {
          distinct_id: data._user,
          payment_id: payment._user,
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
    this.notifyUser(targetUserId, SUPPORT_REQUEST_CONFIRMATION, {
      ticket_id: supportTicket._ticketId,
      requester_email: requesterEmail,
      ticket_subject: subject,
      ticket_description: description,
    });
  }

  async userTrialExpiringWarning(userId) {
    const user = await this.getUserById(userId);

    user.trialExpiringNotified = true;

    await user.save();

    this.notifyUser(userId, TRIAL_EXPIRING);
  }

  async userTrialExpired(userId) {
    const user = await this.getUserById(userId);

    user.isInTrialPeriod = false;

    await user.save();

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
