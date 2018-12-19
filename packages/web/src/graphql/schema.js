const typeDefs = `
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
    legal: [LegalAgreement]
  }
  type LegalAgreement {
    type: LegalAgreementType!
    accepted: String!
  }

  enum LegalAgreementType {
    TERMS_AND_CONDITIONS
    PRIVACY_POLICY
    MARKETING_INFO
  }

  input LegalAgreementInput {
    type: LegalAgreementType!
    accepted: String!
  }
  input UserProfileInput {
    nickname: String!
  }
  input UserPersonalDetailsInput {
    fullName: String!
  }
  input UserNotificationsPreferencesInput {
    notifications: [LegalAgreementInput]!
  }
`;

export default typeDefs;
