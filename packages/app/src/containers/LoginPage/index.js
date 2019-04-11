/**
 *
 * LoginPage
 *
 */

import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import {
  Container,
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Button,
  Alert,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { ReactstrapInput } from 'utils/formiik';
import styled from 'styled-components';
import { ApolloConsumer } from 'react-apollo';

import { GlobalConsumer } from 'GlobalState';
import { LOGIN_USER } from 'graphql/mutations';
import { transformApolloErr } from 'utils/apollo';

const ForgotPasswordContainer = styled.div`
  margin-top: -10px;
  font-size: 12px;
  line-height: 18px;
`;

/* eslint-disable react/prefer-stateless-function */
export default class LoginPage extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      loginErrorMessage: '',
      show2FALostMsg: false,
    };
  }

  render() {
    const { loginErrorMessage, show2FALostMsg } = this.state;

    return (
      <GlobalConsumer>
        {({ setAuthTokens, logIn }) => (
          <Fragment>
            <Helmet>
              <title>Log In</title>
              <meta name="description" content="Authentication page" />
            </Helmet>
            <Container tag="main">
              <Row>
                <Col md={{ size: 6, offset: 3 }}>
                  <Card>
                    <CardHeader>
                      <h3 className="mb-0">Log In2</h3>
                    </CardHeader>
                    <CardBody>
                      <Row>
                        <Col className="text-center">
                          {loginErrorMessage && (
                            <Alert color="danger" role="alert" fade={false}>
                              <strong>{loginErrorMessage}</strong>
                            </Alert>
                          )}
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <ApolloConsumer>
                            {client => (
                              <Formik
                                initialValues={{
                                  email: '',
                                  password: '',
                                  token: '',
                                }}
                                validationSchema={Yup.object().shape({
                                  email: Yup.string()
                                    .email('Invalid email')
                                    .required('Required'),
                                  password: Yup.string().required('Required'),
                                  token: Yup.string(),
                                })}
                                onSubmit={async (values, formikBag) => {
                                  this.setState({
                                    loginErrorMessage: '',
                                    show2FALostMsg: false,
                                  });

                                  try {
                                    const { data } = await client.mutate({
                                      mutation: LOGIN_USER,
                                      variables: {
                                        ...values,
                                      },
                                    });

                                    const {
                                      accessToken,
                                      refreshToken,
                                    } = data.loginUser;

                                    await setAuthTokens({
                                      accessToken,
                                      refreshToken,
                                    });

                                    await logIn();
                                  } catch (e) {
                                    const err = transformApolloErr(e);

                                    if (err.type === 'BAD_USER_INPUT') {
                                      formikBag.setErrors(err.data);

                                      if ('email' in err.data) {
                                        this.setState(prevState => ({
                                          alreadyTakenEmails: [
                                            ...prevState.alreadyTakenEmails,
                                            values.email,
                                          ],
                                        }));
                                      }
                                      if ('token' in err.data) {
                                        this.setState({ show2FALostMsg: true });
                                      }
                                    } else {
                                      this.setState({
                                        loginErrorMessage: err.message,
                                      });
                                    }

                                    formikBag.setSubmitting(false);
                                  }
                                }}
                              >
                                {({ isSubmitting }) => (
                                  <Form>
                                    <Field
                                      component={ReactstrapInput}
                                      name="email"
                                      type="email"
                                      label="Email address"
                                      autoComplete="email"
                                      required
                                    />
                                    <Field
                                      component={ReactstrapInput}
                                      name="password"
                                      type="password"
                                      label="Password"
                                      autoComplete="current-password"
                                      required
                                    />
                                    <ForgotPasswordContainer className="text-right">
                                      <Link
                                        to="/auth/forgot-password"
                                        className="text-muted"
                                      >
                                        forgot password?
                                      </Link>
                                    </ForgotPasswordContainer>
                                    <Field
                                      component={ReactstrapInput}
                                      name="token"
                                      type="text"
                                      label="2FA authentication (if enabled)"
                                      placeholder="Google Authenticator token"
                                      autoComplete="off"
                                    />
                                    <Alert
                                      hidden={!show2FALostMsg}
                                      color="warning"
                                      fade={false}
                                    >
                                      If you have lost your 2FA token, please
                                      open a{' '}
                                      <Link to="/contact-support?subject=I%20lost%20my%202FA%20device&ticketType=LOST_2FA">
                                        support ticket
                                      </Link>
                                      .
                                    </Alert>
                                    <div>
                                      <Button
                                        type="submit"
                                        block
                                        size="lg"
                                        className="btn-theme"
                                        disabled={isSubmitting}
                                      >
                                        <FontAwesomeIcon
                                          pulse
                                          icon={faSpinner}
                                          className={
                                            isSubmitting ? 'mr-2' : 'd-none'
                                          }
                                        />
                                        Log In
                                      </Button>
                                    </div>
                                  </Form>
                                )}
                              </Formik>
                            )}
                          </ApolloConsumer>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                  <div className="mt-5 text-center">
                    <Link to="/signup">Don&#39;t have an account?</Link>
                  </div>
                </Col>
              </Row>
            </Container>
          </Fragment>
        )}
      </GlobalConsumer>
    );
  }
}
