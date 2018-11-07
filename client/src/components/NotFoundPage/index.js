/**
 *
 * NotFoundPage
 *
 */

import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Container, Header, Button } from 'semantic-ui-react';

/* eslint-disable react/prefer-stateless-function */
class NotFoundPage extends React.PureComponent {
  render() {
    return (
      <Fragment>
        <Helmet>
          <title>404</title>
          <meta
            name="description"
            content="Sorry, the page you are looking for doesn't exist."
          />
        </Helmet>
        <Container as="main" textAlign="center">
          <Header as="h1" style={{ fontSize: '6em' }}>
            404
          </Header>
          <p style={{ fontSize: '1.5em' }}>
            Sorry, the page you are looking for doesn&apos;t exist.
          </p>
          <Link to="/">
            <Button size="massive">Return to home page</Button>
          </Link>
        </Container>
      </Fragment>
    );
  }
}

NotFoundPage.propTypes = {};

export default NotFoundPage;
