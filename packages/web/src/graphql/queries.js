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

export const UserPaymentReceipts = gql`
  query getUserPaymentReceipts {
    payments: userPaymentReceipts @requireAuth {
      saleGross
      receiptURL
      receivedAt
    }
  }
`;

export const ActiveSubscriptionPlans = gql`
  query getActiveSubscriptionPlans {
    plans: activeSubscriptionPlans @requireAuth {
      _id
      _paddleProductId
      name
      price
      billingInterval
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
      _plan {
        name
        billingInterval
      }
      status
      unitPrice
      updateURL
      cancelURL
      nextBillDateAt
    }
  }
`;
