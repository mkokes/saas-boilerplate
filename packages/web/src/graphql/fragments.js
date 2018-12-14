import gql from 'graphql-tag';

export const ProfileFields = gql`
  fragment ProfileFields on UserProfile {
    _id
    fullName
    username
    email
    avatar
    isSignUpEmailConfirmed
  }
`;
