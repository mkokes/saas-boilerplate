const typeDefs = `
  type UserProfile {
    _id: String
    fullName: String
    nickname: String
    email: String
    avatar: String
    isSignUpEmailConfirmed: Boolean
  }
  type AuthTokens {
    accessToken: String
    refreshToken: String
  }

  input UserProfileInput {
    nickname: String!
  }
  input UserPersonalDetailsInput {
    fullName: String!
  }
`;

export default typeDefs;
