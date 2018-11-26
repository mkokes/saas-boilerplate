import gql from 'graphql-tag';

export const ProfileFields = gql`
  fragment ProfileFields on UserProfile {
    name
    email
    isEmailConfirmed
  }
`;
