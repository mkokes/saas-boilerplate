/**
 *
 * MainPage
 *
 */

import React, { Fragment } from 'react';
// import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

/* eslint-disable react/prefer-stateless-function */
export default class MainPage extends React.PureComponent {
  render() {
    return (
      <Fragment>
        <Helmet>
          <title>MainPage</title>
          <meta name="description" content="Description of MainPage" />
        </Helmet>
      </Fragment>
    );
  }
}

MainPage.propTypes = {};
