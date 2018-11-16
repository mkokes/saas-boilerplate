/**
 *
 * ForgotPasswordPage
 *
 */

import React, { Fragment } from 'react';
// import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

/* eslint-disable react/prefer-stateless-function */
export default class ForgotPasswordPage extends React.PureComponent {
  render() {
    return (
      <Fragment>
        <Helmet>
          <title>ForgotPasswordPage</title>
          <meta
            name="description"
            content="Description of ForgotPasswordPage"
          />
        </Helmet>
      </Fragment>
    );
  }
}

ForgotPasswordPage.propTypes = {};
