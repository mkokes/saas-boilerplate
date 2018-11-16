/**
 *
 * ResetPasswordPage
 *
 */

import React, { Fragment } from 'react';
// import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

/* eslint-disable react/prefer-stateless-function */
export default class ResetPasswordPage extends React.PureComponent {
  render() {
    return (
      <Fragment>
        <Helmet>
          <title>ResetPasswordPage</title>
          <meta name="description" content="Description of ResetPasswordPage" />
        </Helmet>
      </Fragment>
    );
  }
}

ResetPasswordPage.propTypes = {};
