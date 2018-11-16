import gql from 'graphql-tag';

import { ProfileFields } from './fragments';

export const GetUserQuery = gql`
  ${ProfileFields}

  query getUser {
    ...ProfileFields
  }
`;
