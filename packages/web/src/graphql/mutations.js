import gql from 'graphql-tag';

import { ProfileFields } from './fragments';

// we use this one for checking if user is signed in
export const SignUpUser = gql`
  mutation signUpUser(
    $recaptchaResponse: String
    $email: String!
    $password: String!
    $fullName: String!
  ) {
    signUpUser(
      recaptchaResponse: $recaptchaResponse
      email: $email
      password: $password
      fullName: $fullName
    ) @disableAuth {
      accessToken
      refreshToken
    }
  }
`;

export const LoginUser = gql`
  mutation loginUser($email: String!, $password: String!, $token: String) {
    loginUser(email: $email, password: $password, token: $token) @disableAuth {
      accessToken
      refreshToken
    }
  }
`;
export const LoginUserNoAuth = gql`
  ${ProfileFields}

  mutation loginUserNoAuth {
    profile: loginUserNoAuth @disableAuth {
      ...ProfileFields
    }
  }
`;

export const RefreshAccessToken = gql`
  mutation refreshAccessToken($refreshToken: String!) {
    refreshAccessToken(refreshToken: $refreshToken) @disableAuth {
      accessToken
    }
  }
`;

export const ForgotPassword = gql`
  mutation forgotPassword($email: String!) {
    forgotPassword(email: $email) @disableAuth
  }
`;
export const ResetPassword = gql`
  mutation forgotPassword($resetToken: String!, $newPassword: String!) {
    resetPassword(resetToken: $resetToken, newPassword: $newPassword)
      @disableAuth
  }
`;

export const ConfirmUserEmail = gql`
  mutation confirmUserEmail($confirmationToken: String!) {
    confirmUserEmail(confirmationToken: $confirmationToken) @disableAuth
  }
`;

export const ChangeUserPassword = gql`
  mutation changeUserPassword($oldPassword: String!, $newPassword: String!) {
    changeUserPassword(oldPassword: $oldPassword, newPassword: $newPassword)
      @requireAuth {
      accessToken
      refreshToken
    }
  }
`;

export const UpdateUserProfile = gql`
  ${ProfileFields}
  mutation updateUserProfile($profile: UserProfileInput!) {
    profile: updateUserProfile(profile: $profile) @requireAuth {
      ...ProfileFields
    }
  }
`;

export const UpdateUserPersonalDetails = gql`
  ${ProfileFields}
  mutation updateUserProfile($profile: UserPersonalDetailsInput!) {
    profile: updateUserPersonalDetails(profile: $profile) @requireAuth {
      ...ProfileFields
    }
  }
`;

export const ChangeUserEmail = gql`
  mutation changeUserEmail($password: String!, $email: String!) {
    changeUserEmail(password: $password, email: $email) @requireAuth
  }
`;

export const UpdateUserNotificationsPreferences = gql`
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

export const RequestEnable2FA = gql`
  mutation requestEnable2FA {
    requestEnable2FA @requireAuth {
      secret
      qrcode
    }
  }
`;

export const ConfirmEnable2FA = gql`
  mutation confirmEnable2FA($password: String!, $token: String!) {
    confirmEnable2FA(password: $password, token: $token) @requireAuth
  }
`;

export const Disable2F = gql`
  mutation disable2FA($token: String!) {
    disable2FA(token: $token) @requireAuth
  }
`;

export const Contact = gql`
  mutation contact(
    $recaptchaResponse: String!
    $name: String!
    $email: String!
    $subject: String!
    $message: String!
  ) {
    contact(
      recaptchaResponse: $recaptchaResponse
      name: $name
      email: $email
      subject: $subject
      message: $message
    ) @disableAuth
  }
`;
