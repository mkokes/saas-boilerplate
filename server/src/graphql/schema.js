const { gql } = require('apollo-server-koa');

module.exports = gql`
  type AuthTokens {
    accessToken: String
    refreshToken: String
  }
  type UserProfile {
    name: String
    email: String
  }

  type SignUpResponse {
    profile: UserProfile
    tokens: AuthTokens
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
    ): SignUpResponse
    loginUser: UserProfile
  }
`;
