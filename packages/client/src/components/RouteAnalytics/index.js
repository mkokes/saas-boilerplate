/**
 *
 * RouteAnalytics
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { AnalyticsApi } from 'api/vendors';

/* eslint-disable react/prefer-stateless-function */
class RouteAnalytics extends React.PureComponent {
  render() {
    const { location, children } = this.props;

    AnalyticsApi.track(`Route ${location.pathname}`);

    return children;
  }
}

RouteAnalytics.propTypes = {
  children: PropTypes.object,
  location: PropTypes.object,
};

export default withRouter(RouteAnalytics);
