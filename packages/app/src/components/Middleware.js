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

    // If an authenticated user goes to an /auth route then redirect him.
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

      // Authenticated users cannot go to signup page.
      if (path.indexOf('/signup') === 0) {
        if (user) return <Redirect to="/dashboard" />;
      }

      // Users must verify his email address first before he can interact with dashboard pages
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
