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

export const UserPaymentReceiptsQuery = gql`
  query getUserPaymentReceipts {
    payments: userPaymentReceipts @requireAuth {
      saleGross
      receiptURL
      receivedAt
    }
  }
`;

export const ActivePlansQuery = gql`
  query getActivePlans {
    plans: activeSubscriptionPlans {
      _id
      name
      price
      description
      features
      billingInterval
    }
  }
`;

export const ActiveSubscriptionPlansQuery = gql`
  query getActiveSubscriptionPlans {
    currentSubscription: userSubscription @requireAuth {
      _plan {
        _paddleProductId
        tier
      }
      paymentStatus
    }
    plans: activeSubscriptionPlans @requireAuth {
      _id
      _paddleProductId
      name
      price
      tier
      billingInterval
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
      accessUntil
      paymentStatus
      unitPrice
      updateURL
      cancelURL
      nextBillDateAt
    }
  }
`;

export const IsUserEmailConfirmedQuery = gql`
  query getUserProfile {
    profile: userProfile @requireAuth {
      isSignUpEmailConfirmed
    }
  }
`;
