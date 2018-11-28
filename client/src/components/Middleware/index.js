/**
 *
 * Middleware
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

/* eslint-disable react/prefer-stateless-function */
class Middleware extends React.PureComponent {
  render() {
    const { children, user, path } = this.props;

    if (path) {
      if (path.indexOf('/auth') === 0 || path.indexOf('/signup') === 0) {
        if (user) return <Redirect to="/dashboard/index" />;
      }
      if (path.indexOf('/dashboard') === 0) {
        const EMAIL_VERIFICATION_PATH = '/dashboard/email-verification';

        if (!user.isEmailConfirmed && path !== EMAIL_VERIFICATION_PATH) {
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
};

export default Middleware;
