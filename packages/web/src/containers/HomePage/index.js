/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React, { Fragment } from 'react';
import Helmet from 'react-helmet';
import { Container, Row, Col, Button } from 'reactstrap';
import { Link } from 'react-router-dom';

/* eslint-disable react/prefer-stateless-function */
export default class HomePage extends React.PureComponent {
  render() {
    return (
      <Fragment>
        <Helmet>
          <title>Homepage</title>
          <meta name="description" content="Domain.io homepage" />
        </Helmet>

        <main className="d-flex flex-column flex-grow-1">
          <section className="jumbotron text-center mb-0">
            <div className="container">
              <h1 className="jumbotron-heading">Intro title</h1>
              <p className="lead">
                Make it short and sweet, but not too short so folks dont simply
                skip over it entirely.
              </p>
              <p>
                <Link to="/signup">
                  <Button color="primary" size="lg">
                    <strong>Sign up free</strong>
                  </Button>
                </Link>
              </p>
            </div>
          </section>
          <Container className="d-flex flex-column flex-grow-1 justify-content-center ">
            <Row className="mb-5">
              <Col>
                <h1>Lorem ipsum dolor sit amet, consectetur adipiscin</h1>
                <p className="lead">
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa
                  qui officia deserunt mollit anim id est laborum{' '}
                  <code>padding-top: 60px;</code> liquip ex ea commodo consequat{' '}
                  <code>body &gt; .container</code>. sed quia non numquam eius
                  modi tempora incidunt ut labore et dolore magnam aliquam
                  quaerat voluptatem. Ut enim ad minima veniam, quis nostrum
                  exercitationem ullam corporis suscipit laboriosam, nisi ut
                  aliquid <strong>ex ea commodi consequatur?</strong>
                </p>
              </Col>
            </Row>
            <Row>
              <Col md="4">
                <h2>Heading</h2>
                <p>
                  Donec id elit non mi porta gravida at eget metus. Fusce
                  dapibus, tellus ac cursus commodo, tortor mauris condimentum
                  nibh, ut fermentum massa justo sit amet risus. Etiam porta sem
                  malesuada magna mollis euismod. Donec sed odio dui.{' '}
                </p>
                <p>
                  <Button color="secondary">View details »</Button>
                </p>
              </Col>
              <Col md="4">
                <h2>Heading</h2>
                <p>
                  Donec id elit non mi porta gravida at eget metus. Fusce
                  dapibus, tellus ac cursus commodo, tortor mauris condimentum
                  nibh, ut fermentum massa justo sit amet risus. Etiam porta sem
                  malesuada magna mollis euismod. Donec sed odio dui.{' '}
                </p>
                <p>
                  <Button color="secondary">View details »</Button>
                </p>
              </Col>
              <Col md="4">
                <h2>Heading</h2>
                <p>
                  Donec id elit non mi porta gravida at eget metus. Fusce
                  dapibus, tellus ac cursus commodo, tortor mauris condimentum
                  nibh, ut fermentum massa justo sit amet risus. Etiam porta sem
                  malesuada magna mollis euismod. Donec sed odio dui.{' '}
                </p>
                <p>
                  <Button color="secondary">View details »</Button>
                </p>
              </Col>
            </Row>
          </Container>
        </main>
      </Fragment>
    );
  }
}
