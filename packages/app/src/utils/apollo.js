export const transformApolloErr = e => {
  const { networkError } = e;
  const transformedErr = {
    message: null,
    type: undefined,
    data: {},
  };

  transformedErr.type = networkError.code;
  transformedErr.message = networkError.message;

  // eslint-disable-next-line default-case
  switch (networkError.code) {
    case 'BAD_USER_INPUT':
      transformedErr.message = 'Fix below validation errors to continue';
      transformedErr.data = networkError.data;
      break;
  }

  return transformedErr;
};
