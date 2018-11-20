const validator = require('validator');
const jsonwebtoken = require('jsonwebtoken');
const { ApolloError, UserInputError } = require('apollo-server-koa');

const { assertUser } = require('../utils/asserts');
const { validateRecaptchaResponse } = require('../utils/recaptcha');

module.exports = ({ config: { JWT_SECRET }, db }) => ({
  Query: {
    tokens: () => ({
      accessToken: { value: '1' },
      refreshToken: { value: 'a' },
    }),
  },
  Mutation: {
    signUpUser: async (_, { recaptchaResponse, email, password, name }) => {
      const paramsValidationErrors = {};
      const useRecaptcha = false;

      if (useRecaptcha && validator.isEmpty(recaptchaResponse)) {
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

      if (useRecaptcha) {
        const isRecaptchaValid = await validateRecaptchaResponse(
          recaptchaResponse,
        );

        if (!isRecaptchaValid)
          throw new ApolloError(
            'Submited reCaptcha response is not valid',
            'INVALID_CAPTCHA',
          );
      }

      try {
        const user = await db.signUpUser(email, password, name);

        const accessToken = jsonwebtoken.sign(
          {
            _id: user._id,
          },
          JWT_SECRET,
          { expiresIn: 60 * 5 },
        );
        const refreshToken = jsonwebtoken.sign(
          {
            type: 'refresh',
          },
          JWT_SECRET,
          { expiresIn: '30 days' },
        );

        return { profile: user, tokens: { accessToken, refreshToken } };
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
      const logInErr = new ApolloError('Invalid credentials', 'INVALID_LOGIN');

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
        const user = await db.findUserByEmail(email);
        if (!user) throw logInErr;

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) throw logInErr;

        const userProfile = await db.loginUser(user._id);

        const accessToken = jsonwebtoken.sign(
          {
            _id: user._id,
          },
          JWT_SECRET,
          { expiresIn: 60 * 5 },
        );
        const refreshToken = jsonwebtoken.sign(
          {
            type: 'refresh',
          },
          JWT_SECRET,
          { expiresIn: '30 days' },
        );

        return { profile: userProfile, tokens: { accessToken, refreshToken } };
      } catch (e) {
        throw logInErr;
      }
    },
    loginUserNoAuth: async (_, __, { user }) => {
      console.log('---');
      console.log(user);
      try {
        await assertUser(user);

        return db.loginUser(user._id);
      } catch (e) {
        throw new ApolloError('Cannot log in user', 'INVALID_LOGIN');
      }
    },
    refreshAccessToken: async (_, { refreshToken }) => ({
      accessToken: refreshToken,
    }),
  },
});
