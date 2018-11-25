import gql from 'graphql-tag';

import { ProfileFields } from './fragments';

// we use this one for checking if user is signed in
export const SignUpUser = gql`
  ${ProfileFields}

  mutation signUpUser(
    $recaptchaResponse: String
    $email: String!
    $password: String!
    $name: String!
  ) {
    signUpUser(
      recaptchaResponse: $recaptchaResponse
      email: $email
      password: $password
      name: $name
    ) @disableAuth {
      profile {
        ...ProfileFields
      }
      tokens {
        accessToken
        refreshToken
      }
    }
  }
`;

export const LoginUser = gql`
  ${ProfileFields}

  mutation loginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) @disableAuth {
      profile {
        ...ProfileFields
      }
      tokens {
        accessToken
        refreshToken
      }
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
