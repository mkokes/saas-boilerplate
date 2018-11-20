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
      const { code } = err.graphQLErrors[0].extensions;

      if (code === 'UNAUTHENTICATED') {
        transformedErr.message = 'Authentication is required.';
        transformedErr.type = 'UNAUTHENTICATED';
      }
      if (code === 'FORBIDDEN') {
        transformedErr.message = 'Forbidden.';
        transformedErr.type = 'FORBIDDEN';
      }
      if (code === 'BAD_USER_INPUT') {
        const { validationErrors } = err.graphQLErrors[0].extensions.exception;

        transformedErr.message = 'Fix below validation errors to continue.';
        transformedErr.type = 'BAD_USER_INPUT';
        transformedErr.data = validationErrors;
      }
      if (code === 'INTERNAL_SERVER_ERROR') {
        transformedErr.message =
          'An server error ocurred. Our developers have already been notified and will fix it shortly.';
        transformedErr.type = 'INTERNAL_SERVER_ERROR';
      }
      if (code === 'INVALID_CAPTCHA') {
        transformedErr.message =
          'Our security system could not determine if the request was made by a human. Try it again.';
        transformedErr.type = 'INVALID_CAPTCHA';
      }
    }
  } catch (exception) {
    // eslint-disable-next-line
    console.error('transformApolloErr catch e:', exception);
  }

  if (transformedErr.message === null) {
    transformedErr.message =
      'An unexpected error ocurred. Please try it again or refresh the page if the issue persists.';
  }

  return transformedErr;
};
