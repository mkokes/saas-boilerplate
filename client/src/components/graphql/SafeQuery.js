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
      ...props
    } = this.props;

    return (
      <Query {...props}>
        {result => {
          // if it's a polling refetch call then we still have the data from before
          // so check that this isn't the case
          if (!result.data) {
            const { error } = result;
            if (error) return renderError(result);
            if (isLoading(result)) return renderLoading(result);
          }
          return children(result);
        }}
      </Query>
    );
  }
}
