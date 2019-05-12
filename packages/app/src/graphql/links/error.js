import { onError } from 'apollo-link-error';
import { Observable } from 'apollo-link';

const finalErr = new Error();
finalErr.name = 'apollo_link_error';
finalErr.stack = null;

/* eslint-disable consistent-return, no-console */
const errorLink = () =>
  onError(
    ({ graphQLErrors, networkError }) =>
      new Observable(async observer => {
        console.debug(JSON.stringify(graphQLErrors, null, 2));
        console.debug(JSON.stringify(networkError, null, 2));

        if (graphQLErrors) {
          graphQLErrors.map(async ({ message, path, extensions }) => {
            console.error(
              `[GraphQL error]: Message: ${message}, Path: ${path}, Code: ${
                extensions.code
              }`,
            );

            const { code, exception } = extensions;

            finalErr.message = message;
            finalErr.code = code;

            // eslint-disable-next-line default-case
            switch (extensions.code) {
              case 'INTERNAL_SERVER_ERROR':
                finalErr.message =
                  'An unexpected internal server error ocurred. Our developers have already been notified and will fix it shortly.';
                break;
              case 'BAD_USER_INPUT':
                {
                  const { validationErrors } = exception;

                  finalErr.message = 'Fix validation errors to continue';
                  finalErr.data = validationErrors;
                }
                break;
            }

            return observer.error(finalErr);
          });
        }

        if (networkError) {
          console.error(`[Network error]: ${networkError}`);

          const { statusCode } = networkError;

          switch (statusCode) {
            case 400:
              finalErr.message =
                'We were unable to process your request. Please try it again or refresh the page if the issue persists.';
              finalErr.type = 'CLIENT_BAD_QUERY';
              break;
            default:
              finalErr.message =
                'We were unable to connect to our backend server. Is your internet connection working?';
              finalErr.code = 'FAILED_TO_FETCH';
              break;
          }

          return observer.error(finalErr);
        }
      }),
  );

export default errorLink;
