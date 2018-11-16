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
    ) {
      ...ProfileFields
    }
  }
`;

// we use this one for checking if user is signed in
export const LoginUserNoAuth = gql`
  ${ProfileFields}
  mutation loginUser {
    profile: loginUser @disableAuth {
      ...ProfileFields
    }
  }
`;
