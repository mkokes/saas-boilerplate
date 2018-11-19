const typeDefs = `
  type UserProfile {
    name: String!
  }

  type AuthTokens {
    accessToken: String
    refreshToken: String
  }

  type SignUpResponse {
    profile: UserProfile!
    tokens: AuthTokens!
  }
`;

export default typeDefs;
