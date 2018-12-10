/**
 *
 * PreferencesPage
 *
 */

import React, { Fragment } from 'react';
// import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

/* eslint-disable react/prefer-stateless-function */
export default class PreferencesPage extends React.PureComponent {
  render() {
    return (
      <Fragment>
        <Helmet>
          <title>PreferencesPage</title>
          <meta name="description" content="Description of PreferencesPage" />
        </Helmet>
      </Fragment>
    );
  }
}

PreferencesPage.propTypes = {};
