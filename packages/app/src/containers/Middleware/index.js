/**
 *
 * Middleware
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Redirect } from 'react-router-dom';

/* eslint-disable react/prefer-stateless-function */
class Middleware extends React.PureComponent {
  render() {
    const { children, user, path, location } = this.props;

    if (path) {
      if (path.indexOf('/auth') === 0) {
        let defaultRedirectTo = '/dashboard';

        if (location.state && location.state.from) {
          const { pathname, search, hash } = location.state.from;

          if (pathname !== '/signout') {
            defaultRedirectTo = `${pathname + search + hash}`;
          }
        }

        if (user) return <Redirect to={defaultRedirectTo} />;
      }
      if (path.indexOf('/signup') === 0) {
        if (user) return <Redirect to="/dashboard" />;
      }
      if (path.indexOf('/dashboard') === 0) {
        const EMAIL_VERIFICATION_PATH = '/dashboard/email-verification';

        if (!user.isSignUpEmailConfirmed && path !== EMAIL_VERIFICATION_PATH) {
          return <Redirect to={EMAIL_VERIFICATION_PATH} />;
        }
      }
    }

    return children;
  }
}

Middleware.propTypes = {
  children: PropTypes.object,
  user: PropTypes.object,
  path: PropTypes.string,
  location: PropTypes.object,
};

export default withRouter(Middleware);
