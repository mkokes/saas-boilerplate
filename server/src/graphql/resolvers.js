const validator = require('validator');
const jwt = require('jsonwebtoken');
const { ApolloError, UserInputError } = require('apollo-server-koa');

const { assertRefreshTokenPayload } = require('../utils/asserts');
const { validateRecaptchaResponse } = require('../utils/recaptcha');

const createAccessToken = ({ JWT_SECRET, data }) =>
  jwt.sign(
    {
      ...data,
      type: 'access',
    },
    JWT_SECRET,
    { expiresIn: 60 * 1 },
  );
const createRefreshToken = ({ JWT_SECRET, data }) =>
  jwt.sign(
    {
      ...data,
      type: 'refresh',
    },
    JWT_SECRET,
    { expiresIn: '30 days' },
  );

module.exports = ({ config: { JWT_SECRET }, db }) => ({
  Query: {
    userProfile: async (_, __, { user }) => {
      if (!user) {
        throw new ApolloError('Authentication required', 'UNAUTHENTICATED');
      }

      const profile = await db.getUserProfile(user._id, true);

      return {
        ...profile,
      };
    },
  },
  Mutation: {
    signUpUser: async (_, { recaptchaResponse, email, password, name }) => {
      const paramsValidationErrors = {};

      if (validator.isEmpty(recaptchaResponse)) {
        throw new ApolloError(
          'ReCaptcha response is required to continue',
          'INVALID_CAPTCHA',
        );
      }
      if (!validator.isEmail(email)) {
        paramsValidationErrors.email = 'Email is not valid';
      }
      if (validator.isEmpty(password)) {
        paramsValidationErrors.password = 'Password must be set';
      }
      if (validator.isEmpty(name)) {
        paramsValidationErrors.name = 'What is your name?';
      }
      if (!validator.isLength(name, { min: 2, max: undefined })) {
        paramsValidationErrors.name = 'Too short!';
      }

      if (Object.keys(paramsValidationErrors).length > 0) {
        throw new UserInputError('Failed to sign up due to validation errors', {
          validationErrors: paramsValidationErrors,
        });
      }

      const isRecaptchaValid = await validateRecaptchaResponse(
        recaptchaResponse,
      );

      if (!isRecaptchaValid)
        throw new ApolloError(
          'Submited reCaptcha response is not valid',
          'INVALID_CAPTCHA',
        );

      try {
        const user = await db.signUpUser(email, password, name);

        const accessToken = createAccessToken({
          JWT_SECRET,
          data: {
            _id: user._id,
            password: user.password,
          },
        });
        const refreshToken = createRefreshToken({
          JWT_SECRET,
          data: {
            _id: user._id,
            password: user.password,
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

        return e;
      }
    },
    loginUser: async (_, { email, password }) => {
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

      try {
        const user = await db.getUserByEmail(email);
        if (!user) throw logInErr;

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) throw logInErr;

        const accessToken = createAccessToken({
          JWT_SECRET,
          data: {
            _id: user._id,
            password: user.password,
          },
        });
        const refreshToken = createRefreshToken({
          JWT_SECRET,
          data: {
            _id: user._id,
            password: user.password,
          },
        });

        return { accessToken, refreshToken };
      } catch (e) {
        throw logInErr;
      }
    },
    loginUserNoAuth: async (_, __, { user }) => {
      if (!user) {
        throw new ApolloError('Authentication required', 'UNAUTHENTICATED');
      }

      try {
        return db.loginUser(user._id);
      } catch (e) {
        throw new ApolloError('Cannot log in user', 'INVALID_LOGIN');
      }
    },
    refreshAccessToken: async (_, { refreshToken }) => {
      let decodedPayload;

      try {
        decodedPayload = jwt.verify(refreshToken, JWT_SECRET);

        assertRefreshTokenPayload(decodedPayload);
      } catch (e) {
        throw new ApolloError('Invalid refresh token', 'INVALID_REFRESH_TOKEN');
      }

      const accessToken = createAccessToken({
        JWT_SECRET,
        data: {
          _id: decodedPayload._id,
          password: decodedPayload.password,
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
        'This confirmation link is invalid or has already been confirmed',
        'INVALID_EMAIL_CONFIRMATION_TOKEN',
      );

      if (validator.isEmpty(confirmationToken)) {
        throw invalidTokenErr;
      }

      try {
        await db.confirmUserEmail(confirmationToken);
      } catch (e) {
        switch (e.message) {
          case 'INVALID_EMAIL_CONFIRMATION_TOKEN':
            throw invalidTokenErr;
          default:
            throw e;
        }
      }

      return true;
    },
  },
});
