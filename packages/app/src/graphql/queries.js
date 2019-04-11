import gql from 'graphql-tag';

import { ProfileFields } from './fragments';

export const USER_PROFILE_QUERY = gql`
  ${ProfileFields}

  query getUserProfile {
    profile: userProfile @requireAuth {
      ...ProfileFields
    }
  }
`;

export const USER_PAYMENTS_RECEIPT_QUERY = gql`
  query getUserPaymentsReceipt {
    payments: userPaymentsReceipt @requireAuth {
      saleGross
      receiptURL
      receivedAt
    }
  }
`;

export const ACTIVE_PLANS_QUERY = gql`
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

export const ACTIVE_SUBSCRIPTION_PLANS_QUERY = gql`
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

export const USER_SUBSCRIPTION_QUERY = gql`
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

export const IS_USER_EMAIL_CONFIRMED_QUERY = gql`
  query getUserProfile {
    profile: userProfile @requireAuth {
      isSignUpEmailConfirmed
    }
  }
`;
