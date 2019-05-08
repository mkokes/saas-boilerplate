import gql from 'graphql-tag';

export const ProfileFields = gql`
  fragment ProfileFields on UserProfile {
    _id
    _subscription {
      _id
      servicePeriodEnd
      _plan {
        _id
        name
        features
      }
    }
    accountStatus
    firstName
    lastName
    nickname
    email
    avatar
    isSignUpEmailConfirmed
    hasTwoFactorAuthenticationEnabled
    timezone
  }
`;

export const PlanFields = gql`
  fragment PlanFields on Plan {
    _id
    _paddleProductId
    name
    displayedName
    displayedDescription
    tier
    price
    displayedFeatures
    billingInterval
  }
`;
