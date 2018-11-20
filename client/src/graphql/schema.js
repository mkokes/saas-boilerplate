const typeDefs = `
  type UserProfile {
    name: String!
  }

  type AuthTokens {
    accessToken: String
    refreshToken: String
  }

  type AccessResponse {
    profile: UserProfile!
    tokens: AuthTokens!
  }
`;

export default typeDefs;
