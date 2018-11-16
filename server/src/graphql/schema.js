const { gql } = require('apollo-server-koa');

module.exports = gql`
  type AccessToken {
    str: String!
  }
  type RefreshToken {
    str: String!
  }
  type AuthTokens {
    accessToken: AccessToken
    refreshToken: RefreshToken
  }

  type UserProfile {
    name: String
    email: String
  }

  type Query {
    tokens: AuthTokens
  }
  type Mutation {
    signUpUser(
      recaptchaResponse: String
      email: String!
      password: String!
      name: String!
    ): UserProfile
  }
`;
