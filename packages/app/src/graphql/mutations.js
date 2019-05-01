import gql from 'graphql-tag';

import { ProfileFields } from './fragments';

export const CONTACT_SUPPORT = gql`
  mutation contactSupport(
    $recaptchaResponse: String!
    $requesterName: String!
    $requesterEmail: String!
    $subject: String!
    $ticketType: ContactSupportTicketType!
    $description: String!
  ) {
    contactSupport(
      recaptchaResponse: $recaptchaResponse
      requesterName: $requesterName
      requesterEmail: $requesterEmail
      subject: $subject
      ticketType: $ticketType
      description: $description
    )
  }
`;

export const SIGNUP_USER = gql`
  mutation signUpUser(
    $recaptchaResponse: String
    $email: String!
    $password: String!
    $firstName: String!
    $lastName: String!
    $timezone: String
    $signupSource: String
    $signupIP: String
    $signupCity: String
    $signupCountry: String
  ) {
    signUpUser(
      recaptchaResponse: $recaptchaResponse
      email: $email
      password: $password
      firstName: $firstName
      lastName: $lastName
      timezone: $timezone
      signupSource: $signupSource
      signupIP: $signupIP
      signupCity: $signupCity
      signupCountry: $signupCountry
    ) @disableAuth {
      accessToken
      refreshToken
    }
  }
`;

export const LOGIN_USER = gql`
  mutation loginUser($email: String!, $password: String!, $token: String) {
    loginUser(email: $email, password: $password, token: $token) @disableAuth {
      accessToken
      refreshToken
    }
  }
`;

export const LOGIN_USER_NO_AUTH = gql`
  ${ProfileFields}

  mutation loginUserNoAuth {
    profile: loginUserNoAuth @disableAuth {
      ...ProfileFields
    }
  }
`;

export const REFRESH_ACCESS_TOKEN = gql`
  mutation refreshAccessToken($refreshToken: String!) {
    refreshAccessToken(refreshToken: $refreshToken) @disableAuth {
      accessToken
    }
  }
`;

export const FORGOT_PASSWORD_REQUEST = gql`
  mutation forgotPassword($email: String!, $recaptchaResponse: String!) {
    forgotPassword(email: $email, recaptchaResponse: $recaptchaResponse)
      @disableAuth
  }
`;

export const RESET_USER_PASSWORD = gql`
  mutation forgotPassword($resetToken: String!, $newPassword: String!) {
    resetPassword(resetToken: $resetToken, newPassword: $newPassword)
      @disableAuth
  }
`;

export const CONFIRM_USER_EMAIL = gql`
  mutation confirmUserEmail($confirmationToken: String!) {
    confirmUserEmail(confirmationToken: $confirmationToken) @disableAuth
  }
`;

export const CHANGE_USER_PASSWORD = gql`
  mutation changeUserPassword($oldPassword: String!, $newPassword: String!) {
    changeUserPassword(oldPassword: $oldPassword, newPassword: $newPassword)
      @requireAuth {
      accessToken
      refreshToken
    }
  }
`;

export const UPDATE_USER_PROFILE = gql`
  ${ProfileFields}
  mutation updateUserProfile($profile: UserProfileInput!) {
    profile: updateUserProfile(profile: $profile) @requireAuth {
      ...ProfileFields
    }
  }
`;

export const UPDATE_PERSONAL_DETAILS = gql`
  ${ProfileFields}
  mutation updateUserProfile($profile: UserPersonalDetailsInput!) {
    profile: updateUserPersonalDetails(profile: $profile) @requireAuth {
      ...ProfileFields
    }
  }
`;

export const CHANGE_USER_EMAIL = gql`
  mutation changeUserEmail($password: String!, $email: String!) {
    changeUserEmail(password: $password, email: $email) @requireAuth
  }
`;

export const UPDATE_USER_NOTIFICATIONS_PREFERENCES = gql`
  ${ProfileFields}
  mutation updateUserNotificationsPreferences(
    $notifications: UserNotificationsPreferencesInput!
  ) {
    profile: updateUserNotificationsPreferences(notifications: $notifications)
      @requireAuth {
      ...ProfileFields
    }
  }
`;

export const UPDATE_USER_PREFERENCES = gql`
  ${ProfileFields}
  mutation updateUserPreferences($preferences: UserPreferencesInput!) {
    profile: updateUserPreferences(preferences: $preferences) @requireAuth {
      ...ProfileFields
    }
  }
`;

export const CHANGE_USER_SUBSCRIPTION_PLAN = gql`
  mutation chageUserSubscriptionPlan($planId: String!) {
    success: chageUserSubscriptionPlan(planId: $planId) @requireAuth
  }
`;

export const CANCEL_SUBSCRIPTION_RENEWAL = gql`
  mutation cancelSubscriptionRenewal {
    success: cancelSubscriptionRenewal @requireAuth
  }
`;

export const REQUEST_ENABLE_2FA = gql`
  mutation requestEnable2FA {
    requestEnable2FA @requireAuth {
      secret
      qrcode
    }
  }
`;

export const CONFIRM_ENABLE_2FA = gql`
  mutation confirmEnable2FA($password: String!, $token: String!) {
    confirmEnable2FA(password: $password, token: $token) @requireAuth
  }
`;

export const DISABLE_2FA = gql`
  mutation disable2FA($token: String!) {
    disable2FA(token: $token) @requireAuth
  }
`;

export const REGENERATE_USER_API_SECRET_KEY = gql`
  mutation regenerateUserApiSecretKey {
    profile: regenerateUserApiSecretKey @requireAuth {
      apiSecretKey
    }
  }
`;

export const CREATE_COINBASE_COMMERCE_CHARGE = gql`
  mutation createCoinbaseCommerceCharge($plan: String!) {
    chargeId: createCoinbaseCommerceCharge(plan: $plan) @requireAuth
  }
`;
