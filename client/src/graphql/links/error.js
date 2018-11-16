import { onError } from 'apollo-link-error';

/* eslint-disable no-console */
const errorLink = () =>
  onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) =>
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        ),
      );

    if (networkError) console.error(`[Network error]: ${networkError}`);
  });

export default errorLink;
