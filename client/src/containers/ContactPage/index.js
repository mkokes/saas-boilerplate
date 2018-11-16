/**
 *
 * ContactPage
 *
 */

import React, { Fragment } from 'react';
// import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

/* eslint-disable react/prefer-stateless-function */
export default class ContactPage extends React.PureComponent {
  render() {
    return (
      <Fragment>
        <Helmet>
          <title>ContactPage</title>
          <meta name="description" content="Description of ContactPage" />
        </Helmet>
      </Fragment>
    );
  }
}

ContactPage.propTypes = {};
