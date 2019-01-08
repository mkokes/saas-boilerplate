import gql from 'graphql-tag';

export const ProfileFields = gql`
  fragment ProfileFields on UserProfile {
    _id
    _subscription
    accountStatus
    fullName
    nickname
    email
    avatar
    isSignUpEmailConfirmed
    isTwoFactorAuthenticationEnabled
    isInTrialPeriod
    trialPeriodStartedAt
    timezone
    legal {
      type
      accepted
    }
  }
`;
