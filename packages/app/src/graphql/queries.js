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

export const PLANS_QUERY = gql`
  query getPlans {
    plans: plans {
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
  query getActivePlans {
    currentSubscription: userSubscription @requireAuth {
      _plan {
        _paddleProductId
        tier
      }
      paymentStatus
    }
    plans: plans @requireAuth {
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
      servicePeriodEnd
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
