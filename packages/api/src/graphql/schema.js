const { gql } = require('apollo-server-koa');

module.exports = gql`
  type AuthTokens {
    accessToken: String
    refreshToken: String
  }
  type UserProfile {
    _id: String
    fullName: String
    nickname: String
    email: String
    avatar: String
    isSignUpEmailConfirmed: Boolean
  }

  input UserProfileInput {
    nickname: String!
  }
  input UserPersonalDetailsInput {
    fullName: String!
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
    ): AuthTokens
    loginUser(email: String!, password: String!): AuthTokens
    loginUserNoAuth: UserProfile
    refreshAccessToken(refreshToken: String!): AuthTokens
    forgotPassword(email: String!): Boolean
    resetPassword(resetToken: String!, newPassword: String!): Boolean
    confirmUserEmail(confirmationToken: String!): Boolean
    changeUserPassword(oldPassword: String!, newPassword: String!): AuthTokens
    changeUserEmail(password: String!, email: String!): Boolean
    updateUserProfile(profile: UserProfileInput!): UserProfile
    updateUserPersonalDetails(profile: UserPersonalDetailsInput!): UserProfile
    contact(
      recaptchaResponse: String!
      name: String!
      email: String!
      subject: String!
      message: String!
    ): Boolean
  }
`;
