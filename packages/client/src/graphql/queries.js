import gql from 'graphql-tag';

import { ProfileFields } from './fragments';

export const UserProfileQuery = gql`
  ${ProfileFields}
  query getUserProfile {
    profile: userProfile @requireAuth {
      ...ProfileFields
    }
  }
`;

export const isUserEmailConfirmedQuery = gql`
  query getUserProfile {
    profile: userProfile @requireAuth {
      isEmailConfirmed
    }
  }
`;
