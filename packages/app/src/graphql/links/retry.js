import { RetryLink } from 'apollo-link-retry';

export default () =>
  new RetryLink({
    delay: {
      initial: 300,
      max: Infinity,
      jitter: true,
    },
    attempts: {
      max: 10,
      retryIf: error => !!error,
    },
  });
