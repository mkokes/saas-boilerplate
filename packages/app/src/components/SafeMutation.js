import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';

import ErrorBox from 'components/ErrorBox';
import Loader from 'components/Loader';
import { transformApolloErr } from 'utils/apollo';

export const DEFAULT_IS_LOADING = ({ loading }) => loading;
export const DEFAULT_RENDER_ERROR = ({ error }) => {
  const _error = transformApolloErr(error);

  const blacklistRenderErrorTypes = ['BAD_USER_INPUT'];
  if (blacklistRenderErrorTypes.indexOf(_error.type) > -1) return null;

  return <ErrorBox className="text-center">{_error.message}</ErrorBox>;
};
export const DEFAULT_RENDER_LOADING = () => <Loader />;

DEFAULT_RENDER_ERROR.propTypes = {
  error: PropTypes.string,
};

class DoMutation extends React.Component {
  static propTypes = {
    mutate: PropTypes.func,
  };

  componentDidMount() {
    const { mutate } = this.props;
    mutate();
  }

  render() {
    return null;
  }
}

// eslint-disable-next-line react/prefer-stateless-function, react/no-multi-comp
export default class SafeMutation extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    isLoading: PropTypes.func,
    renderError: PropTypes.func,
    renderLoading: PropTypes.func,
    showError: PropTypes.bool,
    showLoading: PropTypes.bool,
    executeOnMount: PropTypes.bool,
  };

  render() {
    const {
      children,
      isLoading = DEFAULT_IS_LOADING,
      renderError = DEFAULT_RENDER_ERROR,
      renderLoading = DEFAULT_RENDER_LOADING,
      showError = false,
      showLoading = false,
      executeOnMount = false,
      ...props
    } = this.props;

    return (
      <Mutation {...props}>
        {(_mutator, result) => {
          const mutator = async opts => {
            try {
              return await _mutator(opts);
            } catch (e) {
              if (executeOnMount) return null;

              throw transformApolloErr(e);
            }
          };

          return (
            <>
              {executeOnMount ? <DoMutation mutate={mutator} /> : null}
              {result.error && showError ? renderError(result) : null}
              {isLoading(result) && showLoading ? renderLoading(result) : null}
              {children(executeOnMount ? null : mutator, result || {})}
            </>
          );
        }}
      </Mutation>
    );
  }
}
