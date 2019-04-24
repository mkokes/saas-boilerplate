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
      _paddleReceiptURL
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

export const USER_SUBSCRIPTION = gql`
  query getUserSubscription {
    subscription: userSubscription @requireAuth {
      paymentStatus
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
      paymentStatus
      paymentMethod
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
      startedAt
      servicePeriodEnd
      paymentMethod
      paymentStatus
      unitPrice
      _paddleUpdateURL
      _paddleCancelURL
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
