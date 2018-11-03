/**
 *
 * ScrollToTop
 *
 */

import React from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

class ScrollToTop extends React.Component {
  componentDidUpdate(prevProps) {
    const { location } = this.props;

    if (location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    const { children } = this.props;

    return children;
  }
}
ScrollToTop.propTypes = {
  location: PropTypes.object,
  children: PropTypes.object,
};

export default withRouter(ScrollToTop);
