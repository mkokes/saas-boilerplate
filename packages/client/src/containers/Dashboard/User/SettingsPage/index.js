/**
 *
 * SettingsPage
 *
 */

import React, { Fragment } from 'react';
// import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

/* eslint-disable react/prefer-stateless-function */
export default class SettingsPage extends React.PureComponent {
  render() {
    return (
      <Fragment>
        <Helmet>
          <title>User Settings</title>
          <meta name="description" content="Description of User Settings" />
        </Helmet>
        <h1>foo</h1>
      </Fragment>
    );
  }
}

SettingsPage.propTypes = {};
