export const transformApolloErr = e => {
  const err = e;

  err.message = err.message.toLowerCase();

  const transformedErr = {
    message: null,
    type: undefined,
    data: {},
  };

  try {
    if (err.message.includes('failed to fetch')) {
      transformedErr.message =
        'We were unable to connect to our backend server. Is your internet connection working?';
      transformedErr.type = 'FAILED_TO_FETCH';
    }
    if (err.networkError) {
      const { statusCode } = err.networkError;

      if (statusCode === 400) {
        transformedErr.message =
          'We were unable to process your request. Please try it again or refresh the page if the issue persists.';
        transformedErr.type = 'CLIENT_BAD_QUERY';
      }
    }
    if (err.graphQLErrors.length) {
      const { message } = err.graphQLErrors[0];
      const { code } = err.graphQLErrors[0].extensions;
      transformedErr.type = code;
      transformedErr.message = message;

      if (code === 'FORBIDDEN') {
        transformedErr.message = 'Access Forbidden';
      }
      if (code === 'BAD_USER_INPUT') {
        const { validationErrors } = err.graphQLErrors[0].extensions.exception;

        transformedErr.message = 'Fix below validation errors to continue';
        transformedErr.data = validationErrors;
      }
      if (code === 'INTERNAL_SERVER_ERROR') {
        transformedErr.message =
          'An unexpected server error ocurred. Our developers have already been notified and will fix it shortly.';
      }
    }
  } catch (exception) {
    // eslint-disable-next-line
    console.error('transformApolloErr catched exception:', exception);
  }

  if (transformedErr.type === undefined || transformedErr.message === null) {
    transformedErr.message =
      'An unexpected error ocurred. Please try it again or refresh the page if the issue persists.';
  }

  return transformedErr;
};
