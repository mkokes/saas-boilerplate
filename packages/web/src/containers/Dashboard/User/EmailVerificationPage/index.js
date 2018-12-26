/**
 *
 * EmailVerificationPage
 *
 */

import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { Container, Row, Col, Alert } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import { GlobalConsumer } from 'GlobalState';
import SafeQuery from 'components/graphql/SafeQuery';
import { isUserEmailConfirmedQuery } from 'graphql/queries';

/* eslint-disable react/prefer-stateless-function */
export default class EmailVerificationPage extends React.PureComponent {
  render() {
    return (
      <GlobalConsumer>
        {({ setUserProfile, userProfile }) => (
          <Fragment>
            <Helmet>
              <title>Forgot password</title>
              <meta
                name="description"
                content="Description of ForgotPasswordPage"
              />
            </Helmet>

            {userProfile.isSignUpEmailConfirmed ? (
              <Redirect to="/dashboard" />
            ) : (
              <Container
                tag="main"
                className="flex flex-column justify-content-center"
              >
                <Row className="justify-content-center">
                  <Col md="12" className="text-center">
                    <SafeQuery
                      query={isUserEmailConfirmedQuery}
                      fetchPolicy="network-only"
                      pollInterval={3000}
                      keepExistingResultDuringRefetch
                    >
                      {({ data: { profile = {} } }) => {
                        if (profile.isSignUpEmailConfirmed) {
                          const updatedUserProfile = userProfile;

                          updatedUserProfile.isSignUpEmailConfirmed = true;
                          setUserProfile(updatedUserProfile);
                        }

                        return (
                          <Fragment>
                            <img
                              src="/email-verification.png"
                              alt="foo"
                              height="224"
                            />
                            <Alert color="primary">
                              <h4 className="alert-heading">
                                {' '}
                                Almost done... we need to{' '}
                                <strong>verify your email address</strong>{' '}
                                before you can continue
                              </h4>
                              <p>
                                We have sent an email with a confirmation link
                                to your email address (
                                <strong>{userProfile.email}</strong>
                                ).
                              </p>
                              <hr />
                              <FontAwesomeIcon
                                pulse
                                size="2x"
                                icon={faSpinner}
                              />
                              <p className="mt-3 mb-0">
                                <strong>Waiting for verification ...</strong>
                              </p>
                            </Alert>
                          </Fragment>
                        );
                      }}
                    </SafeQuery>
                  </Col>
                </Row>
              </Container>
            )}
          </Fragment>
        )}
      </GlobalConsumer>
    );
  }
}
