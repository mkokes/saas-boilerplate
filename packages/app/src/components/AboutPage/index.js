/**
 *
 * AboutPage
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import { Container, Row, Col } from 'reactstrap';

/* eslint-disable react/prefer-stateless-function */
class AboutPage extends React.PureComponent {
  render() {
    return (
      <main className="flex-grow-1">
        <Helmet>
          <title>AboutPage</title>
          <meta name="description" content="Description of AboutPage" />
        </Helmet>
        <section className="jumbotron text-center">
          <div className="container">
            <h1 className="jumbotron-heading">About Domain.io</h1>
            <span className="lead">A few details...</span>
          </div>
        </section>
        <Container>
          <Row className="pb-4 pt-4">
            <Col>
              <p className="lead">
                <strong>Lorem ipsum dolor sit amet</strong>, consectetur
                adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex{' '}
                <strong>ea commodo consequat</strong>. Duis aute irure dolor in
                reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit{' '}
                <strong>anim id est laborum</strong>.
              </p>
            </Col>
          </Row>
          <Row>
            <Col>
              <h2>Lorem ipsum dolor sit amet</h2>
              <p className="lead">
                <strong>Lorem ipsum dolor sit amet</strong>, consectetur
                adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex{' '}
                <strong>ea commodo consequat</strong>. Duis aute irure dolor in
                reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit{' '}
                <strong>anim id est laborum</strong>.
              </p>
            </Col>
          </Row>
          <Row>
            <Col>
              <h2>incididunt ut labore et</h2>
              <p className="lead">
                <strong>Lorem ipsum dolor sit amet</strong>, consectetur
                adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex{' '}
                <strong>ea commodo consequat</strong>. Duis aute irure dolor in
                reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit{' '}
                <strong>anim id est laborum</strong>.
              </p>
            </Col>
          </Row>
        </Container>
      </main>
    );
  }
}

export default AboutPage;
