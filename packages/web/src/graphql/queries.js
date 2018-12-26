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
      isSignUpEmailConfirmed
    }
  }
`;

export const UserSubscriptionQuery = gql`
  query getUserSubscription {
    subscription: userSubscription @requireAuth {
      status
      updateURL
      cancelURL
    }
  }
`;
