const validator = require('validator');
const { ApolloError, UserInputError } = require('apollo-server-koa');

module.exports = ({ db }) => ({
  Query: {
    tokens: () => ({
      accessToken: { value: '1' },
      refreshToken: { value: 'a' },
    }),
  },
  Mutation: {
    signUpUser: async (_, { recaptchaResponse, email, password, name }) => {
      const validationErrors = {};
      const useRecaptcha = true;

      if (validator.isEmpty(recaptchaResponse)) {
        throw new ApolloError(
          'ReCaptcha response is required to continue',
          'INVALID_CAPTCHA',
        );
      }
      if (!validator.isEmail(email)) {
        validationErrors.email = 'Email is not valid';
      }
      if (validator.isEmpty(password)) {
        validationErrors.password = 'Password must be set';
      }
      if (validator.isEmpty(name)) {
        validationErrors.name = 'What is your name?';
      }
      if (!validator.isLength(name, { min: 2, max: undefined })) {
        validationErrors.name = 'Too short!';
      }

      if (Object.keys(validationErrors).length > 0) {
        throw new UserInputError('Failed to sign up due to validation errors', {
          validationErrors,
        });
      }

      return db.signUpUser(
        useRecaptcha,
        recaptchaResponse,
        email,
        password,
        name,
      );
    },
  },
});
