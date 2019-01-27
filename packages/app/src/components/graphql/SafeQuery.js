import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';

import {
  DEFAULT_IS_LOADING,
  DEFAULT_RENDER_ERROR,
  DEFAULT_RENDER_LOADING,
} from './SafeMutation';

export default class SafeQuery extends Component {
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
      keepExistingResultDuringRefetch = false,
      ...props
    } = this.props;

    return (
      <Query {...props}>
        {result => {
          if (
            Object.entries(result.data).length > 0 &&
            keepExistingResultDuringRefetch
          ) {
            return children(result);
          }

          if (isLoading(result) && showLoading) {
            return renderLoading(result);
          }

          const { error } = result;
          if (error && showError) {
            return renderError(result);
          }

          return children(result);
        }}
      </Query>
    );
  }
}
