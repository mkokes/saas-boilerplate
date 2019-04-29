const typeDefs = `
  type AuthTokens {
    accessToken: String
    refreshToken: String
  }
  type UserProfile {
    _id: String
    _subscription: String
    accountStatus: String
    firstName: String
    lastName: String
    nickname: String
    email: String
    avatar: String
    isSignUpEmailConfirmed: Boolean
    isTwoFactorAuthenticationEnabled: Boolean
    timezone: String
    apiSecretKey: String,
    legal: [LegalAgreement]
  }
  type USER_PAYMENTS_RECEIPT_QUERY {
    saleGross: String
    _paddleReceiptURL: String
    paymentMethod: String
    receivedAt: String
  }
  type Plan {
    _id: String
    _paddleProductId: Int
    name: String
    displayName: String
    displayedDescription: String
    tier: Int
    features: [String]
    price: Float
    billingInterval: String
  }
  type Subscription {
    _id: String
    _plan: Plan
    status: String
    startedAt: String
    servicePeriodEnd: String
    paymentMethod: String
    paymentStatus: String
    price: Float
    _paddleUpdateURL: String
    _paddleCancelURL: String
    nextBillDateAt: String
  }
  type LegalAgreement {
    type: LegalAgreementType!
    accepted: String!
  }
  type TwoFactorAuthentication {
    secret: String!
    qrcode: String!
  }

  enum ContactSupportTicketType {
    QUESTION
    PROBLEM
    BILLING
    FEATURE_REQUEST
    BUG_REPORT
    LOST_2FA
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
    firstName: String!
    lastName: String!
  }
  input UserNotificationsPreferencesInput {
    notifications: [LegalAgreementInput]!
  }
  input UserPreferencesInput {
    timezone: String!
  }
`;

export default typeDefs;
