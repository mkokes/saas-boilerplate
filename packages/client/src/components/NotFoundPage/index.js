/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { Link } from 'react-router-dom';

/* eslint-disable react/prefer-stateless-function */
export default class NotFound extends React.PureComponent {
  render() {
    return (
      <Container tag="main">
        <Row className="justify-content-center">
          <Col md="12" className="text-center">
            <span className="display-1 d-block">404</span>
            <span className="display-4 lead">
              The page you are looking for was not found
            </span>
            <Link to="/">
              <Button size="lg" className="mt-4">
                <strong>Return to home page</strong>
              </Button>
            </Link>
          </Col>
        </Row>
      </Container>
    );
  }
}
