/**
 *
 * EmailVerificationPage
 *
 */

import React, { useEffect, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { Container, Row, Col, Button, Alert } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { withApollo } from 'react-apollo';

import { GlobalConsumer } from 'GlobalState';
import { isUserEmailConfirmedQuery } from 'graphql/queries';

function EmailVerification(props) {
  useEffect(() => {
    (async () => {
      try {
        const {
          data: { profile },
        } = await props.client.query({
          query: isUserEmailConfirmedQuery,
        });

        console.debug('got profile', profile);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      // @TODO: Cleanup here
      console.debug('cleanup here');
    };
  });

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
                    We have sent an email with a confirmation link to your email
                    address (<strong>{userProfile.email}</strong>
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

export default withApollo(EmailVerification);
