/**
 *
 * LoginPage
 *
 */

import React, { Fragment } from 'react';
import Helmet from 'react-helmet';
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
import { LoginUser } from 'graphql/mutations';
import { transformApolloErr } from 'utils/apollo';
import { AnalyticsApi } from 'api/vendors';

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
    };
  }

  render() {
    const { loginErrorMessage } = this.state;

    return (
      <GlobalConsumer>
        {({ setAuthTokens, signIn }) => (
          <Fragment>
            <Helmet>
              <title>Sign in</title>
              <meta name="description" content="Description of LoginPage" />
            </Helmet>
            <Container
              tag="main"
              className="flex flex-column justify-content-center"
            >
              <Row>
                <Col md={{ size: 6, offset: 3 }}>
                  <Card>
                    <CardHeader>
                      <h3 className="mb-0">Log in</h3>
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
                                }}
                                validationSchema={Yup.object().shape({
                                  email: Yup.string()
                                    .email('Invalid email')
                                    .required('Required'),
                                  password: Yup.string().required('Required'),
                                })}
                                onSubmit={async (values, formikBag) => {
                                  this.setState({
                                    loginErrorMessage: null,
                                  });

                                  try {
                                    const { data } = await client.mutate({
                                      mutation: LoginUser,
                                      variables: {
                                        ...values,
                                      },
                                    });
                                    AnalyticsApi.track('Logged in');

                                    const {
                                      accessToken,
                                      refreshToken,
                                    } = data.loginUser;

                                    await setAuthTokens({
                                      accessToken,
                                      refreshToken,
                                    });

                                    signIn();
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
                                    }

                                    formikBag.setSubmitting(false);
                                    this.setState({
                                      loginErrorMessage: err.message,
                                    });
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
                                    <ForgotPasswordContainer className="text-right mb-3">
                                      <Link
                                        to="/auth/forgot-password"
                                        className="text-muted"
                                      >
                                        forgot password?
                                      </Link>
                                    </ForgotPasswordContainer>
                                    <div>
                                      <Button
                                        type="submit"
                                        block
                                        size="lg"
                                        color="success"
                                        disabled={isSubmitting}
                                      >
                                        <FontAwesomeIcon
                                          pulse
                                          icon={faSpinner}
                                          className={
                                            isSubmitting ? 'mr-2' : 'd-none'
                                          }
                                        />
                                        Log in to access
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
                    <Link to="/signup">Don&#39;t have an account? Sign up</Link>
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
