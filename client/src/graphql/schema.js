const typeDefs = `
  type UserProfile {
    name: String!
  }

  type AuthTokens {
    accessToken: String
    refreshToken: String
  }
`;

export default typeDefs;
