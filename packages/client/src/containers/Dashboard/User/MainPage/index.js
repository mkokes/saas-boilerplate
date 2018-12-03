/**
 *
 * MainPage
 *
 */

import React, { Fragment } from 'react';
// import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';
import { Helmet } from 'react-helmet';

import { GlobalConsumer } from 'GlobalState';

/* eslint-disable react/prefer-stateless-function */
export default class MainPage extends React.PureComponent {
  render() {
    return (
      <GlobalConsumer>
        {() => (
          <Fragment>
            <Helmet>
              <title>Dashboard index</title>
              <meta
                name="description"
                content="Description of ForgotPasswordPage"
              />
            </Helmet>
            <Container tag="main">
              <Row>
                <Col>
                  <span>TBC</span>
                </Col>
              </Row>
            </Container>
          </Fragment>
        )}
      </GlobalConsumer>
    );
  }
}

MainPage.propTypes = {};