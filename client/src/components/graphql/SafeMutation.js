import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';

import ErrorBox from 'components/ErrorBox';

// import { transformError } from 'utils/graphql';

export const DEFAULT_IS_LOADING = ({ loading }) => loading;
export const DEFAULT_RENDER_ERROR = ({ error }) => {
  /* eslint-disable no-console */
  console.error(error);
  // const transformedError = transformError(error);

  let errStr = `${error}`;
  const errStrLowercase = errStr.toLowerCase();

  if (errStrLowercase.includes('failed to fetch')) {
    errStr =
      'We were unable to connect to our backend server. Is your internet connection working?';
  }

  return <ErrorBox>{errStr}</ErrorBox>;
};
export const DEFAULT_RENDER_LOADING = () => <div>Loading</div>;

DEFAULT_RENDER_ERROR.propTypes = {
  error: PropTypes.string,
};

/* eslint-disable react/prefer-stateless-function */
export default class SafeMutation extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
  };

  render() {
    const {
      children,
      isLoading = DEFAULT_IS_LOADING,
      renderError = DEFAULT_RENDER_ERROR,
      renderLoading = DEFAULT_RENDER_LOADING,
      showError = false,
      showLoading = false,
      ...props
    } = this.props;

    return (
      <Mutation {...props}>
        {(mutator, result) => (
          <>
            {result.error && showError ? renderError(result) : null}
            {isLoading(result) && showLoading ? renderLoading(result) : null}
            {children(mutator, result.data || {})}
          </>
        )}
      </Mutation>
    );
  }
}
