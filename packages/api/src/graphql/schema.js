const { gql } = require('apollo-server-koa');

module.exports = gql`
  type AuthTokens {
    accessToken: String
    refreshToken: String
  }
  type UserProfile {
    fullName: String
    username: String
    email: String
    avatar: String
    isEmailConfirmed: Boolean
  }

  type Query {
    userProfile: UserProfile
  }
  type Mutation {
    signUpUser(
      recaptchaResponse: String
      email: String!
      password: String!
      fullName: String!
      username: String!
    ): AuthTokens
    loginUser(email: String!, password: String!): AuthTokens
    loginUserNoAuth: UserProfile
    refreshAccessToken(refreshToken: String!): AuthTokens
    forgotPassword(email: String!): Boolean
    resetPassword(resetToken: String!, newPassword: String!): Boolean
    confirmUserEmail(confirmationToken: String!): Boolean
    changeUserPassword(oldPassword: String!, newPassword: String!): Boolean
    contact(
      recaptchaResponse: String!
      name: String!
      email: String!
      subject: String!
      message: String!
    ): Boolean
  }
`;
