/**
 *
 * RouteAnalytics
 *
 */

import { useEffect } from 'react';
import { withRouter } from 'react-router-dom';

import { AnalyticsApi } from 'api/vendors';

function RouteAnalytics(props) {
  const { location, children } = props;

  useEffect(() => {
    AnalyticsApi.ga.pageview(location.pathname + location.search);
  });

  return children;
}

export default withRouter(RouteAnalytics);
