/**
 *
 * SignupPage
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
import { ReactstrapInput } from 'utils/formiik';
import * as Yup from 'yup';
import { ApolloConsumer } from 'react-apollo';
import Reaptcha from 'reaptcha';
import MomentTimezone from 'moment-timezone';

import { SignUpUser } from 'graphql/mutations';
import { transformApolloErr } from 'utils/apollo';
import { GlobalConsumer } from 'GlobalState';
import { AnalyticsApi } from 'api/vendors';

/* eslint-disable react/prefer-stateless-function */
export default class SignupPage extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      recaptchaResponse: '',
      recaptchaRendered: false,
      signUpErrorMessage: '',
      alreadyTakenEmails: [],
    };

    this.captcha = null;
  }

  resetCaptcha() {
    this.setState({ recaptchaResponse: '' });
    this.captcha.reset();
  }

  render() {
    const {
      recaptchaResponse,
      recaptchaRendered,
      signUpErrorMessage,
      alreadyTakenEmails,
    } = this.state;

    return (
      <GlobalConsumer>
        {({ setAuthTokens, signUp }) => (
          <Fragment>
            <Helmet>
              <title>Sign up</title>
              <meta name="description" content="Registration form" />
            </Helmet>

            <Container tag="main">
              <Row>
                <Col md={{ size: 6, offset: 3 }}>
                  <Card>
                    <CardHeader>
                      <h3 className="mb-0">Sign up</h3>
                    </CardHeader>
                    <CardBody>
                      {signUpErrorMessage && (
                        <Row>
                          <Col className="text-center">
                            <Alert color="danger" role="alert" fade={false}>
                              <strong>{signUpErrorMessage}</strong>
                            </Alert>
                          </Col>
                        </Row>
                      )}
                      <Row>
                        <Col>
                          <ApolloConsumer>
                            {client => (
                              <Formik
                                initialValues={{
                                  email: '',
                                  firstName: '',
                                  lastName: '',
                                  password: '',
                                }}
                                validationSchema={() =>
                                  Yup.object().shape({
                                    email: Yup.string()
                                      .email('Invalid email')
                                      .notOneOf(
                                        alreadyTakenEmails,
                                        'Already in use, use another email',
                                      )
                                      .required('Required'),
                                    firstName: Yup.string()
                                      .min(2, 'Too short!')
                                      .required('Required'),
                                    lastName: Yup.string()
                                      .min(2, 'Too short!')
                                      .required('Required'),
                                    password: Yup.string().required('Required'),
                                  })
                                }
                                onSubmit={async (values, formikBag) => {
                                  this.setState({
                                    signUpErrorMessage: null,
                                  });

                                  if (!recaptchaRendered)
                                    await this.captcha.renderExplicitly();

                                  if (!recaptchaResponse) {
                                    await this.captcha.execute();
                                    setTimeout(
                                      () => formikBag.setSubmitting(false),
                                      2000,
                                    );
                                    return;
                                  }

                                  try {
                                    const { data } = await client.mutate({
                                      mutation: SignUpUser,
                                      variables: {
                                        ...values,
                                        timezone: MomentTimezone.tz.guess(),
                                        recaptchaResponse,
                                      },
                                    });

                                    const {
                                      accessToken,
                                      refreshToken,
                                    } = data.signUpUser;

                                    await setAuthTokens({
                                      accessToken,
                                      refreshToken,
                                    });

                                    await signUp();
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
                                    } else {
                                      this.setState({
                                        signUpErrorMessage: err.message,
                                      });
                                    }

                                    this.resetCaptcha();
                                    formikBag.setSubmitting(false);
                                  }
                                }}
                              >
                                {({ submitForm, isSubmitting }) => (
                                  <Form>
                                    <Row>
                                      <Col>
                                        <Field
                                          component={ReactstrapInput}
                                          name="firstName"
                                          type="text"
                                          placeholder="John Doe"
                                          label="First name"
                                          autoComplete="first-name"
                                          required
                                        />
                                      </Col>
                                      <Col>
                                        <Field
                                          component={ReactstrapInput}
                                          name="lastName"
                                          type="text"
                                          placeholder="Smith"
                                          label="Last name"
                                          autoComplete="last-name"
                                          required
                                        />
                                      </Col>
                                    </Row>
                                    <Field
                                      component={ReactstrapInput}
                                      name="email"
                                      type="email"
                                      placeholder="john@acme.com"
                                      label="Email address"
                                      autoComplete="username" // using "username" forces browsers to use email when login
                                      required
                                    />
                                    <Field
                                      component={ReactstrapInput}
                                      name="password"
                                      type="password"
                                      placeholder="Password"
                                      label="Password"
                                      autoComplete="new-password"
                                      required
                                    />

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
                                      Submit
                                    </Button>

                                    <Reaptcha
                                      // eslint-disable-next-line
                                      ref={e => (this.captcha = e)}
                                      sitekey={
                                        process.env.REACT_APP_RECAPTCHA_SITE_KEY
                                      }
                                      onVerify={res => {
                                        this.setState({
                                          recaptchaResponse: res,
                                        });
                                        submitForm();
                                      }}
                                      onExpire={() => this.resetCaptcha}
                                      onError={() => this.resetCaptcha}
                                      onRender={() =>
                                        this.setState({
                                          recaptchaRendered: true,
                                        })
                                      }
                                      size="invisible"
                                      explicit
                                    />
                                    <p className="mt-1 pr-5 pl-5 text-center text-muted small">
                                      By signing up, you agree to our{' '}
                                      <a href="/legal/terms#tos" target="popup">
                                        Terms of Service
                                      </a>{' '}
                                      and that you have read our{' '}
                                      <a href="/legal/terms#pp" target="popup">
                                        Privacy Policy
                                      </a>
                                      .
                                    </p>
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
                    <Link to="/auth/login">
                      Already have an account? Log in
                    </Link>
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
