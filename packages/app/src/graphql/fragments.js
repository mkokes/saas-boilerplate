import gql from 'graphql-tag';

export const ProfileFields = gql`
  fragment ProfileFields on UserProfile {
    _id
    _subscription
    accountStatus
    firstName
    lastName
    nickname
    email
    avatar
    isSignUpEmailConfirmed
    hasTwoFactorAuthenticationEnabled
    timezone
    legal {
      type
      accepted
    }
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
