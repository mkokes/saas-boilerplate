const { gql } = require('apollo-server-koa');

module.exports = gql`
  type AuthTokens {
    accessToken: String
    refreshToken: String
  }
  type UserProfile {
    _id: String
    _subscription: Subscription
    accountStatus: String
    firstName: String
    lastName: String
    nickname: String
    email: String
    avatar: String
    isSignUpEmailConfirmed: Boolean
    hasTwoFactorAuthenticationEnabled: Boolean
    timezone: String
    apiSecretKey: String
    legal: [LegalAgreement]
  }
  type Payment {
    _shortId: String
    saleGross: String
    _paddleReceiptURL: String
    paymentMethod: String
    receivedAt: String
  }
  type Plan {
    _id: String
    _paddleProductId: Int
    name: String
    displayedName: String
    displayedDescription: String
    displayedFeatures: [String]
    price: Float
    tier: Int
    billingInterval: String
  }
  type Subscription {
    _id: String
    _plan: Plan
    status: String
    startedAt: String
    servicePeriodEnd: String
    type: String
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
    BILLING
    PROBLEM
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

  type Query {
    userProfile: UserProfile
    userApiSecretKey: UserProfile
    userSubscription: Subscription
    userSubscriptionPlan: Plan
    userPaymentsReceipt: [Payment]
    plans: [Plan]
  }
  type Mutation {
    contactSupport(
      recaptchaResponse: String!
      requesterName: String!
      requesterEmail: String!
      subject: String!
      ticketType: ContactSupportTicketType!
      description: String!
    ): Boolean
    signUpUser(
      recaptchaResponse: String
      email: String!
      password: String!
      firstName: String!
      lastName: String!
      timezone: String
      signupSource: String
      signupIP: String
      signupCity: String
      signupCountry: String
    ): AuthTokens
    loginUser(email: String!, password: String!, token: String): AuthTokens
    loginUserNoAuth: UserProfile
    refreshAccessToken(refreshToken: String!): AuthTokens
    forgotPassword(email: String!, recaptchaResponse: String!): Boolean
    resetPassword(resetToken: String!, newPassword: String!): Boolean
    confirmUserEmail(confirmationToken: String!): Boolean
    changeUserPassword(oldPassword: String!, newPassword: String!): AuthTokens
    requestUserEmailChange(password: String!, email: String!): Boolean
    updateUserProfile(profile: UserProfileInput!): UserProfile
    updateUserPersonalDetails(profile: UserPersonalDetailsInput!): UserProfile
    updateUserNotificationsPreferences(
      notifications: UserNotificationsPreferencesInput!
    ): UserProfile
    updateUserPreferences(preferences: UserPreferencesInput!): UserProfile
    chageUserSubscriptionPlan(planId: String!): Boolean
    cancelSubscriptionRenewal: Boolean
    requestEnable2FA: TwoFactorAuthentication
    confirmEnable2FA(password: String!, token: String!): Boolean
    disable2FA(token: String!): Boolean
    regenerateUserApiSecretKey: UserProfile
    createCoinbaseCommerceCharge(plan: String!): String
  }
`;
