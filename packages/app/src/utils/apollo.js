export const transformApolloErr = e => {
  const { networkError } = e;

  const transformedErr = new Error();
  transformedErr.name = 'apollo_link_error';
  transformedErr.data = {};

  transformedErr.message = networkError.message;
  transformedErr.type = networkError.code;

  // eslint-disable-next-line default-case
  switch (networkError.code) {
    case 'BAD_USER_INPUT':
      transformedErr.message = 'Fix below validation errors to continue';
      transformedErr.data = networkError.data;
      break;
  }

  return transformedErr;
};
