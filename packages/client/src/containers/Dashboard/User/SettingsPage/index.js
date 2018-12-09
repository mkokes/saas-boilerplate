/**
 *
 * SettingsPage
 *
 */

import React, { Fragment } from 'react';
// import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Container } from 'reactstrap';

/* eslint-disable react/prefer-stateless-function */
export default class SettingsPage extends React.PureComponent {
  render() {
    return (
      <Fragment>
        <Helmet>
          <title>User Settings</title>
          <meta name="description" content="Description of User Settings" />
        </Helmet>
        <Container tag="main">
          <h1>Settings page</h1>
        </Container>
      </Fragment>
    );
  }
}

SettingsPage.propTypes = {};
