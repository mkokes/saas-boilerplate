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
    loginUser: async (_, __, { user }) => {
      await assertUser(user);

      return db.loginUser(user._id);
    },
  },
});
