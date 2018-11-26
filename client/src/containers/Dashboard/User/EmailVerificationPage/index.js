/**
 *
 * EmailVerificationPage
 *
 */

import React, { Fragment } from 'react';
// import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Container, Row, Col, Button, Alert } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import { GlobalConsumer } from 'GlobalState';

/* eslint-disable react/prefer-stateless-function */
export default class EmailVerificationPage extends React.PureComponent {
  render() {
    return (
      <GlobalConsumer>
        {({ userProfile }) => (
          <Fragment>
            <Helmet>
              <title>Forgot password</title>
              <meta
                name="description"
                content="Description of ForgotPasswordPage"
              />
            </Helmet>
            <Container tag="main">
              <Row className="justify-content-center">
                <Col md="12" className="text-center">
                  <img src="/email-verification.png" alt="foo" height="224" />
                  <Alert color="primary">
                    <h4 className="alert-heading">
                      {' '}
                      Almost done... we need to{' '}
                      <strong>verify your e-mail address</strong> before you can
                      continue
                    </h4>
                    <p>
                      We have sent an email with a confirmation link to your
                      email address (<strong>{userProfile.email}</strong>
                      ).
                    </p>
                    <hr />
                    <FontAwesomeIcon pulse size="2x" icon={faSpinner} />
                    <p className="mt-3 mb-0">
                      <strong>Waiting for verification ...</strong>
                    </p>
                  </Alert>
                </Col>
              </Row>
            </Container>
          </Fragment>
        )}
      </GlobalConsumer>
    );
  }
}

EmailVerificationPage.propTypes = {};
