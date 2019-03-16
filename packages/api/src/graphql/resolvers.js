const safeGet = require('lodash.get');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const { ApolloError, UserInputError } = require('apollo-server-koa');
const axios = require('axios');
const momentTimezone = require('moment-timezone');

const { MARKETING_INFO } = require('../constants/legal');
const { assertRefreshTokenPayload } = require('../utils/asserts');
const { validateRecaptchaResponse } = require('../utils/recaptcha');

// We set our own JWT iat to avoid clock skew issue: @URL: https://en.wikipedia.org/wiki/Clock_skew
const createAccessToken = ({ JWT_SECRET, data }) =>
  jwt.sign(
    {
      iat: parseInt((Date.now() / 1000).toFixed(0), 10),
      ...data,
      type: 'access',
    },
    JWT_SECRET,
    { expiresIn: 60 * 1 },
  );
const createRefreshToken = ({ JWT_SECRET, data }) =>
  jwt.sign(
    {
      iat: parseInt((Date.now() / 1000).toFixed(0), 10),
      ...data,
      type: 'refresh',
    },
    JWT_SECRET,
    { expiresIn: '30 days' },
  );

const assertUser = async user => {
  if (!safeGet(user, '_id')) {
    throw new ApolloError('Authentication required', 'UNAUTHENTICATED');
  }
};

module.exports = ({
  config: { JWT_SECRET, PADDLE_VENDOR_ID, PADDLE_VENDOR_AUTH_CODE },
  db,
  log,
  mixpanel,
}) => ({
  Query: {
    userProfile: async (_, __, { user }) => {
      await assertUser(user);

      const profile = await db.getUserProfile(user._id, true);

      return {
        ...profile,
      };
    },
    userSubscription: async (_, __, { user }) => {
      await assertUser(user);

      const subscription = await db.getUserSubscription(user._id);

      return subscription;
    },
    userPaymentReceipts: async (_, __, { user }) => {
      await assertUser(user);

      const payments = await db.getUserPayments(user._id);

      return payments;
    },
    activeSubscriptionPlans: async () => {
      const plans = await db.getActiveSubscriptionPlans();

      return plans;
    },
  },
  Mutation: {
    contactSupport: async (
      _,
      { requesterName, requesterEmail, subject, ticketType, description },
    ) => {
      const paramsValidationErrors = {};

      /* if (validator.isEmpty(recaptchaResponse)) {
        throw new ApolloError(
          'Our security system could not determine if the request was made by a human. Try it again.',
          'INVALID_CAPTCHA',
        );
      } */

      if (Object.keys(paramsValidationErrors).length > 0) {
        throw new UserInputError(
          'Failed to process your request due to validation errors',
          {
            validationErrors: paramsValidationErrors,
          },
        );
      }

      /* const isRecaptchaValid = await validateRecaptchaResponse(
        recaptchaResponse,
      );

      if (!isRecaptchaValid) {
        throw new ApolloError(
          'Our security system could not determine if the request was made by a human. Try it again.',
          'INVALID_CAPTCHA',
        );
      } */

      console.log('got it');
      console.log(requesterName);

      return true;
    },
    signUpUser: async (
      _,
      { recaptchaResponse, email, password, firstName, lastName, timezone },
    ) => {
      const paramsValidationErrors = {};

      if (validator.isEmpty(recaptchaResponse)) {
        throw new ApolloError(
          'Our security system could not determine if the request was made by a human. Try it again.',
          'INVALID_CAPTCHA',
        );
      }
      if (!validator.isEmail(email)) {
        paramsValidationErrors.email = 'Email is not valid';
      }
      if (validator.isEmpty(password)) {
        paramsValidationErrors.password = 'Password must be set';
      }
      if (validator.isEmpty(firstName)) {
        paramsValidationErrors.firstName = 'First name is required';
      }
      if (!validator.isLength(firstName, { min: 2, max: undefined })) {
        paramsValidationErrors.firstName = 'Too short!';
      }
      if (validator.isEmpty(lastName)) {
        paramsValidationErrors.lastName = 'Last name is required';
      }
      if (!validator.isLength(lastName, { min: 2, max: undefined })) {
        paramsValidationErrors.lastName = 'Too short!';
      }

      if (Object.keys(paramsValidationErrors).length > 0) {
        throw new UserInputError('Failed to sign up due to validation errors', {
          validationErrors: paramsValidationErrors,
        });
      }

      const isRecaptchaValid = await validateRecaptchaResponse(
        recaptchaResponse,
      );

      if (!isRecaptchaValid) {
        throw new ApolloError(
          'Our security system could not determine if the request was made by a human. Try it again.',
          'INVALID_CAPTCHA',
        );
      }

      try {
        const user = await db.signUpUser(
          email,
          password,
          firstName,
          lastName,
          timezone,
        );

        const accessToken = createAccessToken({
          JWT_SECRET,
          data: {
            _id: user._id,
          },
        });
        const refreshToken = createRefreshToken({
          JWT_SECRET,
          data: {
            _id: user._id,
          },
        });

        return { accessToken, refreshToken };
      } catch (e) {
        if (e.name === 'ValidationError') {
          const userValidationErrors = {};

          Object.entries(e.errors).forEach(([key, value]) => {
            userValidationErrors[key] = value.message;
          });

          return new UserInputError(
            'Failed to sign up due to validation errors',
            { validationErrors: userValidationErrors },
          );
        }

        throw e;
      }
    },
    loginUser: async (_, { email, password, token }) => {
      const paramsValidationErrors = {};
      const logInErr = new ApolloError(
        'Invalid credentials',
        'INVALID_LOGIN_CREDENTIALS',
      );

      if (!validator.isEmail(email)) {
        paramsValidationErrors.email = 'Email is not valid';
      }
      if (validator.isEmpty(password)) {
        paramsValidationErrors.password = 'Need password';
      }
      if (Object.keys(paramsValidationErrors).length > 0) {
        throw new UserInputError('Failed to log in due to validation errors', {
          validationErrors: paramsValidationErrors,
        });
      }

      const user = await db.getUserByEmail(email);

      try {
        if (!user) throw logInErr;

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) throw logInErr;
      } catch (e) {
        throw logInErr;
      }

      if (user.isTwoFactorAuthenticationEnabled) {
        const is2FAValid = await db.check2FAUser(user._id, token);
        if (!is2FAValid) {
          throw new UserInputError('Failed to log in', {
            validationErrors: {
              token: 'Provided code is not valid, please try it again',
            },
          });
        }
      }

      const accessToken = createAccessToken({
        JWT_SECRET,
        data: {
          _id: user._id,
        },
      });
      const refreshToken = createRefreshToken({
        JWT_SECRET,
        data: {
          _id: user._id,
        },
      });

      return { accessToken, refreshToken };
    },
    loginUserNoAuth: async (_, __, { user }) => {
      const err = new ApolloError('Cannot log in user', 'INVALID_LOGIN');

      if (!user) {
        throw err;
      }

      try {
        return db.loginUser(user._id);
      } catch (e) {
        throw err;
      }
    },
    refreshAccessToken: async (_, { refreshToken }) => {
      let decodedJWT;
      try {
        decodedJWT = jwt.verify(refreshToken, JWT_SECRET);
        assertRefreshTokenPayload(decodedJWT);
      } catch (e) {
        throw new ApolloError('Invalid refresh token', 'INVALID_REFRESH_TOKEN');
      }

      const challengeStatus = await db.authChallenge(
        decodedJWT._id,
        decodedJWT.iat,
      );
      if (!challengeStatus) {
        throw new ApolloError(
          'User did not pass auth challenge',
          'INVALID_REFRESH_TOKEN',
        );
      }

      const accessToken = createAccessToken({
        JWT_SECRET,
        data: {
          _id: decodedJWT._id,
        },
      });

      return { accessToken };
    },
    forgotPassword: async (_, { email }) => {
      if (!validator.isEmail(email)) {
        throw new UserInputError(
          'Failed to process forgot password request due to validation errors',
          {
            validationErrors: { email: 'Invalid email' },
          },
        );
      }

      const user = await db.getUserByEmail(email);
      if (!user) throw new ApolloError('User does not exists', '');

      db.forgotPasswordRequest(user._id);

      return true;
    },
    resetPassword: async (_, { resetToken, newPassword }) => {
      const paramsValidationErrors = {};

      if (validator.isEmpty(resetToken)) {
        paramsValidationErrors.resetToken = 'Provided reset token is not valid';
      }
      if (validator.isEmpty(newPassword)) {
        paramsValidationErrors.newPassword = 'Invalid password';
      }

      if (Object.keys(paramsValidationErrors).length > 0) {
        throw new UserInputError(
          'Failed to reset password due to validation errors',
          {
            validationErrors: paramsValidationErrors,
          },
        );
      }

      try {
        await db.resetPasswordRequest(resetToken, newPassword);
      } catch (e) {
        switch (e.message) {
          case 'INVALID_PASSWORD_RESET_TOKEN':
            throw new ApolloError(
              'Password reset link is invalid or expired',
              'INVALID_PASSWORD_RESET_TOKEN',
            );
          default:
            throw e;
        }
      }

      return true;
    },
    confirmUserEmail: async (_, { confirmationToken }) => {
      const invalidTokenErr = new ApolloError(
        'This confirmation link is invalid or has already been used',
        'UNABLE_EMAIL_CONFIRMATION',
      );

      if (validator.isEmpty(confirmationToken)) {
        throw invalidTokenErr;
      }

      try {
        await db.confirmUserEmail(confirmationToken);
      } catch (e) {
        switch (e.message) {
          case 'UNABLE_EMAIL_CONFIRMATION':
            throw invalidTokenErr;
          case 'CANDIDATE_EMAIL_TAKEN':
            throw new ApolloError(
              'Oops! the email address you choosen was used by another user before you. Please try it again.',
              'UNABLE_EMAIL_CONFIRMATION',
            );
          case 'SIGNUP_EMAIL_ALREADY_VERIFIED':
            throw invalidTokenErr;
          default:
            throw e;
        }
      }

      return true;
    },
    changeUserPassword: async (_, { oldPassword, newPassword }, { user }) => {
      await assertUser(user);

      const paramsValidationErrors = {};

      if (validator.isEmpty(oldPassword)) {
        paramsValidationErrors.oldPassword = 'Invalid old password';
      }
      if (validator.isEmpty(newPassword)) {
        paramsValidationErrors.newPassword = 'Invalid password';
      }

      if (Object.keys(paramsValidationErrors).length > 0) {
        throw new UserInputError(
          'Failed to change password due to validation errors',
          {
            validationErrors: paramsValidationErrors,
          },
        );
      }

      try {
        await db.changeUserPassword(user._id, oldPassword, newPassword);
      } catch (e) {
        switch (e.message) {
          case 'INVALID_OLD_PASSWORD':
            throw new UserInputError(
              'Failed to change password due to validation errors',
              {
                validationErrors: {
                  oldPassword:
                    'Password does not match your current account password',
                },
              },
            );
          default:
            throw e;
        }
      }

      const accessToken = createAccessToken({
        JWT_SECRET,
        data: {
          _id: user._id,
        },
      });
      const refreshToken = createRefreshToken({
        JWT_SECRET,
        data: {
          _id: user._id,
        },
      });

      return { accessToken, refreshToken };
    },
    changeUserEmail: async (_, { password, email }, { user }) => {
      await assertUser(user);

      const userInputError = errors =>
        new UserInputError('Failed to change email due to validation errors', {
          validationErrors: errors,
        });

      const paramsValidationErrors = {};

      if (validator.isEmpty(password)) {
        paramsValidationErrors.password = 'Password required';
      }
      if (!validator.isEmail(email)) {
        paramsValidationErrors.email = 'Invalid email';
      }

      if (Object.keys(paramsValidationErrors).length > 0) {
        throw userInputError(paramsValidationErrors);
      }

      const emailAlreadyTaken = await db.existsUserWithEmail(email);
      if (emailAlreadyTaken) {
        throw userInputError({
          email: 'Email already in use by another user',
        });
      }
      const passwordMatches = await db.compareUserPassword(user._id, password);
      if (!passwordMatches) {
        throw userInputError({
          password: 'Password does not match your current account password',
        });
      }

      await db.changeUserEmail(user._id, email);

      return true;
    },
    updateUserProfile: async (_, { profile }, { user }) => {
      await assertUser(user);

      const { nickname } = profile;

      const userInputError = errors =>
        new UserInputError(
          'Failed to update user profile due to validation errors',
          {
            validationErrors: errors,
          },
        );
      const paramsValidationErrors = {};

      if (
        typeof nickname !== 'string' ||
        !nickname ||
        !/^[A-Za-z0-9_]{2,16}$/.test(nickname)
      ) {
        paramsValidationErrors.nickname =
          'Nickname must be between 2 and 16 characters and only contains letters, numbers and underscores.';
      }

      if (Object.keys(paramsValidationErrors).length > 0) {
        throw userInputError(paramsValidationErrors);
      }

      return db.updateUserProfile(user._id, profile);
    },
    updateUserPersonalDetails: async (_, { profile }, { user }) => {
      await assertUser(user);

      const { firstName, lastName } = profile;

      const userInputError = errors =>
        new UserInputError(
          'Failed to update user personal details due to validation errors',
          {
            validationErrors: errors,
          },
        );
      const paramsValidationErrors = {};

      if (
        typeof firstName !== 'string' ||
        !firstName ||
        !/^[^0-9_]{2,48}$/.test(firstName)
      ) {
        paramsValidationErrors.firstName =
          'First name must be between 2 and 48 characters and not contain numbers or underscores.';
      }
      if (
        typeof lastName !== 'string' ||
        !lastName ||
        !/^[^0-9_]{2,48}$/.test(lastName)
      ) {
        paramsValidationErrors.lastName =
          'Last name must be between 2 and 48 characters and not contain numbers or underscores.';
      }

      if (Object.keys(paramsValidationErrors).length > 0) {
        throw userInputError(paramsValidationErrors);
      }

      return db.updateUserPersonalDetails(user._id, profile);
    },
    updateUserNotificationsPreferences: async (
      _,
      { notifications: { notifications } },
      { user },
    ) => {
      await assertUser(user);

      const NOTIFICATIONS_KEYS = [MARKETING_INFO];
      const validationErr = new Error(
        'Received invalid/manipulated notification object',
      );

      const validatedNotifications = notifications.map(notification => {
        if (!safeGet(notification, 'type')) {
          throw validationErr;
        }
        if (!safeGet(notification, 'accepted')) {
          throw validationErr;
        }

        if (!notification.type.includes(NOTIFICATIONS_KEYS)) {
          throw validationErr;
        }
        if (new Date(1545182734734).getTime() < 0) {
          throw validationErr;
        }

        return notification;
      });

      return db.updateUserNotificationsPreferences(
        user._id,
        validatedNotifications,
      );
    },
    updateUserPreferences: async (_, { preferences }, { user }) => {
      await assertUser(user);

      const validTimezones = momentTimezone.tz.names();
      if (!validTimezones.includes(preferences.timezone)) {
        throw UserInputError(
          'Failed to update user preferences due to validation errors',
          {
            validationErrors: {
              timezone: 'Invalid timezone',
            },
          },
        );
      }

      return db.updateUserPreferences(user._id, preferences);
    },
    chageUserSubscriptionPlan: async (_, { planId }, { user }) => {
      await assertUser(user);

      if (!planId) {
        throw new ApolloError('Request validation failed', 'NEED_PLANID_INPUT');
      }

      const currentUserSubscription = await db.getUserSubscription(user._id);
      if (!currentUserSubscription) {
        throw new ApolloError(
          'Subscription not found',
          'USER_SUBSCRIPTION_NOT_FOUND',
        );
      }
      if (currentUserSubscription.paymentStatus !== 'active') {
        throw new ApolloError(
          'Cannot change subscription plan because your current subscription is not active',
          'USER_SUBSCRIPTION_NOT_ACTIVE',
        );
      }
      if (currentUserSubscription._plan._id.toString() === planId) {
        if (!currentUserSubscription) {
          throw new ApolloError(
            'Cannot change subscription plan to same plan',
            'CANNOT_CHANGE_SAME_PLAN',
          );
        }
      }

      const plan = await db.getPlanById(planId);
      if (!plan) {
        throw new ApolloError('Requested plan was not found', 'PLAN_NOT_FOUND');
      }
      if (plan.status !== 'active') {
        throw new ApolloError(
          'Requested plan is not active',
          'PLAN_NOT_ACTIVE',
        );
      }

      try {
        const response = await axios.post(
          'https://vendors.paddle.com/api/2.0/subscription/users/update',
          {
            vendor_id: PADDLE_VENDOR_ID,
            vendor_auth_code: PADDLE_VENDOR_AUTH_CODE,
            subscription_id: currentUserSubscription._paddleSubscriptionId,
            plan_id: plan._paddleProductId,
            quantity: 1,
            bill_immediately: true,
          },
        );
        const paddleResponse = response.data;
        if (!paddleResponse.success) {
          throw new Error(paddleResponse.error.message);
        }

        mixpanel.track('subscription plan change', {
          distinct_id: user._id,
          old_plan_id: currentUserSubscription._plan._id,
          new_plan_id: planId,
        });
      } catch (e) {
        log.error(e);
        throw e;
      }

      return true;
    },
    requestEnable2FA: async (_, __, { user }) => {
      await assertUser(user);

      return db.generate2FAUser(user._id);
    },
    confirmEnable2FA: async (_, { password, token }, { user }) => {
      await assertUser(user);

      const userInputError = errors =>
        new UserInputError('Failed to enable 2FA due to validation errors', {
          validationErrors: errors,
        });

      const passwordMatches = await db.compareUserPassword(user._id, password);
      if (!passwordMatches) {
        throw userInputError({
          password: 'Password does not match your current account password',
        });
      }

      try {
        await db.confirmEnable2FAUser(user._id, token);
      } catch (e) {
        switch (e.message) {
          case 'INVALID_TOKEN':
            throw userInputError({
              token: 'Provided code is not valid, please try it again',
            });
          default:
            throw e;
        }
      }

      return true;
    },
    disable2FA: async (_, { token }, { user }) => {
      await assertUser(user);

      const userInputError = errors =>
        new UserInputError('Failed to enable 2FA due to validation errors', {
          validationErrors: errors,
        });

      try {
        await db.disable2FA(user._id, token);
      } catch (e) {
        switch (e.message) {
          case 'INVALID_TOKEN':
            throw userInputError({
              token: 'Provided code is not valid, please try it again',
            });
          default:
            throw e;
        }
      }

      return true;
    },
  },
});
