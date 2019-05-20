/**
 *
 * EmailVerificationPage
 *
 */

import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { Container, Row, Col, Button, Alert } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import { GlobalConsumer } from 'GlobalState';
import SafeQuery from 'components/SafeQuery';
import { IS_USER_EMAIL_CONFIRMED_QUERY } from 'graphql/queries';

/* eslint-disable react/prefer-stateless-function */
export default class EmailVerificationPage extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      redirectToSignUpPage: false,
    };
  }

  render() {
    const { redirectToSignUpPage } = this.state;

    return (
      <GlobalConsumer>
        {({ userProfile, setUserProfile }) => (
          <Fragment>
            <Helmet>
              <title>Email Verification</title>
              <meta name="robots" content="noindex, follow" />
            </Helmet>

            {redirectToSignUpPage && (
              <Redirect to="/signout?redirect=/signup" />
            )}
            {userProfile.isSignUpEmailConfirmed ? (
              <Redirect to="/dashboard" />
            ) : (
              <Container tag="main" className="flex flex-column ">
                <Row className="justify-content-center">
                  <Col md="12" className="text-center">
                    <SafeQuery
                      query={IS_USER_EMAIL_CONFIRMED_QUERY}
                      fetchPolicy="cache-and-network"
                      pollInterval={3000}
                      keepExistingResultDuringRefetch
                      showError
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
                              src="/images/email-verification.png"
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
                                to your email address:{' '}
                                <strong>{userProfile.email}</strong>.
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
                            <span className="text-muted">
                              Wrong email address used?{' '}
                              <Button
                                color="link"
                                className="p-0 pb-1"
                                onClick={async () =>
                                  this.setState({ redirectToSignUpPage: true })
                                }
                              >
                                create a new account
                              </Button>
                            </span>
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
