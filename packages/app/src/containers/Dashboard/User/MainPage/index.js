/**
 *
 * MainPage
 *
 */

import React, { Fragment } from 'react';
import { Container } from 'reactstrap';
import { Helmet } from 'react-helmet';

/* eslint-disable react/prefer-stateless-function */
export default class MainPage extends React.PureComponent {
  render() {
    return (
      <Fragment>
        <Helmet>
          <title>Dashboard index</title>
          <meta
            name="description"
            content="Description of User dashboard main page"
          />
        </Helmet>
        <Container tag="main">
          <h1>Main</h1>
        </Container>
      </Fragment>
    );
  }
}

MainPage.propTypes = {};
