const { gql } = require('apollo-server-koa');

module.exports = gql`
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
    isTwoFactorAuthenticationEnabled: Boolean
    legal: [LegalAgreement]
  }
  type LegalAgreement {
    type: LegalAgreementType!
    accepted: String!
  }
  type TwoFactorAuthentication {
    secret: String!
    qrcode: String!
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

  type Query {
    userProfile: UserProfile
  }
  type Mutation {
    signUpUser(
      recaptchaResponse: String
      email: String!
      password: String!
      fullName: String!
    ): AuthTokens
    loginUser(email: String!, password: String!, token: String): AuthTokens
    loginUserNoAuth: UserProfile
    refreshAccessToken(refreshToken: String!): AuthTokens
    forgotPassword(email: String!): Boolean
    resetPassword(resetToken: String!, newPassword: String!): Boolean
    confirmUserEmail(confirmationToken: String!): Boolean
    changeUserPassword(oldPassword: String!, newPassword: String!): AuthTokens
    changeUserEmail(password: String!, email: String!): Boolean
    updateUserProfile(profile: UserProfileInput!): UserProfile
    updateUserPersonalDetails(profile: UserPersonalDetailsInput!): UserProfile
    updateUserNotificationsPreferences(
      notifications: UserNotificationsPreferencesInput!
    ): UserProfile
    requestEnable2FA: TwoFactorAuthentication
    confirmEnable2FA(password: String!, token: String!): Boolean
    disable2FA(token: String!): Boolean
    contact(
      recaptchaResponse: String!
      name: String!
      email: String!
      subject: String!
      message: String!
    ): Boolean
  }
`;
