import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';

import ErrorBox from 'components/ErrorBox';

import { transformApolloErr } from 'utils/apollo';

export const DEFAULT_IS_LOADING = ({ loading }) => loading;
export const DEFAULT_RENDER_ERROR = ({ error }) => {
  /* eslint-disable no-console */
  console.error(error);
  const transformedError = transformApolloErr(error);

  return <ErrorBox>{transformedError.message}</ErrorBox>;
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
