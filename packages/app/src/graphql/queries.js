import gql from 'graphql-tag';

import { ProfileFields, PlanFields } from './fragments';

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
  ${PlanFields}

  query getPlans {
    plans: plans {
      ...PlanFields
    }
  }
`;

export const USER_SUBSCRIPTION_PLAN = gql`
  ${PlanFields}

  query getUserSubscriptionPlan {
    plan: userSubscriptionPlan @requireAuth {
      ...PlanFields
    }
  }
`;

export const BILLING_SHOW_PLANS_QUERY = gql`
  ${PlanFields}

  query getActivePlans {
    currentSubscription: userSubscription @requireAuth {
      _plan {
        _paddleProductId
        tier
      }
      paymentStatus
    }
    currentPlan: userSubscriptionPlan @requireAuth {
      ...PlanFields
    }
    plans: plans @requireAuth {
      ...PlanFields
    }
  }
`;
export const BILLING_CURRENT_SUBSCRIPTION = gql`
  ${PlanFields}

  query getUserSubscription {
    plan: userSubscriptionPlan @requireAuth {
      ...PlanFields
    }
    subscription: userSubscription @requireAuth {
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
