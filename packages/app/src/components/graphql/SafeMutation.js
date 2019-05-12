import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';

import ErrorBox from 'components/ErrorBox';
import Loader from 'components/Loader';
import { transformApolloErr } from 'utils/apollo';

export const DEFAULT_IS_LOADING = ({ loading }) => loading;
export const DEFAULT_RENDER_ERROR = ({ error }) => (
  <ErrorBox className="text-center">
    {transformApolloErr(error).message}
  </ErrorBox>
);
export const DEFAULT_RENDER_LOADING = () => <Loader />;

DEFAULT_RENDER_ERROR.propTypes = {
  error: PropTypes.string,
};

/* eslint-disable react/prefer-stateless-function */
export default class SafeMutation extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    isLoading: PropTypes.func,
    renderError: PropTypes.func,
    renderLoading: PropTypes.func,
    showError: PropTypes.bool,
    showLoading: PropTypes.bool,
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
        {(_mutator, result) => {
          const mutator = async opts => {
            try {
              return await _mutator(opts);
            } catch (e) {
              throw transformApolloErr(e);
            }
          };

          return (
            <>
              {result.error && showError ? renderError(result) : null}
              {isLoading(result) && showLoading ? renderLoading(result) : null}
              {children(mutator, result || {})}
            </>
          );
        }}
      </Mutation>
    );
  }
}
