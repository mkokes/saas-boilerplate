const { gql } = require('apollo-server-koa');

module.exports = gql`
  type AuthTokens {
    accessToken: String
    refreshToken: String
  }
  type AccessResponse {
    profile: UserProfile!
    tokens: AuthTokens!
  }
  type UserProfile {
    name: String
    email: String
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
      name: String!
    ): AccessResponse
    loginUser(email: String!, password: String!): AccessResponse
    loginUserNoAuth: UserProfile
    refreshAccessToken(refreshToken: String!): AuthTokens
    forgotPassword(email: String!): Boolean
    resetPassword(resetToken: String!, newPassword: String!): Boolean
  }
`;
