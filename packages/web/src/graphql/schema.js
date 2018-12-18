const typeDefs = `
  type UserProfile {
    _id: String
    fullName: String
    username: String
    email: String
    avatar: String
    isSignUpEmailConfirmed: Boolean
  }
  type AuthTokens {
    accessToken: String
    refreshToken: String
  }

  input UserProfileInput {
    username: String
  }
`;

export default typeDefs;
