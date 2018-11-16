/**
 *
 * EmailConfirmationPage
 *
 */

import React, { Fragment } from 'react';
// import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

/* eslint-disable react/prefer-stateless-function */
export default class EmailConfirmationPage extends React.PureComponent {
  render() {
    return (
      <Fragment>
        <Helmet>
          <title>EmailConfirmationPage</title>
          <meta
            name="description"
            content="Description of EmailConfirmationPage"
          />
        </Helmet>
      </Fragment>
    );
  }
}

EmailConfirmationPage.propTypes = {};
