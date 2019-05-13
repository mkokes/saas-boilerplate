/**
 *
 * ForgotPasswordPage
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
import { faSpinner, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import { ReactstrapInput } from 'utils/formiik';
import { ApolloConsumer } from 'react-apollo';
import Reaptcha from 'reaptcha';

import { FORGOT_PASSWORD_REQUEST } from 'graphql/mutations';
import { transformApolloErr } from 'utils/apollo';
import config from 'config';

const PasswordResetText = styled('div')`
  margin-top: -15px;
  margin-bottom: 20px;
`;

const { RECAPTCHA_SITE_KEY } = config;

/* eslint-disable react/prefer-stateless-function */
export default class ForgotPasswordPage extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      formMsg: null,
      recaptchaResponse: '',
      recaptchaRendered: false,
    };

    this.captcha = null;
  }

  resetCaptcha() {
    this.setState({ recaptchaResponse: '' });

    try {
      this.captcha.reset();
      // eslint-disable-next-line no-empty
    } catch (_) {}
  }

  render() {
    const { formMsg, recaptchaResponse, recaptchaRendered } = this.state;

    return (
      <Fragment>
        <Helmet>
          <title>Forgot password</title>
          <meta
            name="description"
            content="Forgot your account password? request a password reset"
          />
        </Helmet>
        <Container tag="main">
          <Row>
            <Col md={{ size: 6, offset: 3 }}>
              <Card>
                <CardHeader>
                  <h3 className="mb-0">Reset Request</h3>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col className="text-center">
                      {formMsg && (
                        <Alert color={formMsg.color} role="alert" fade={false}>
                          <strong>{formMsg.text}</strong>
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
                            }}
                            validationSchema={Yup.object().shape({
                              email: Yup.string()
                                .email('Invalid email')
                                .required('Required'),
                            })}
                            onSubmit={async (values, formikBag) => {
                              this.setState({ formMsg: null });

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
                                await client.mutate({
                                  mutation: FORGOT_PASSWORD_REQUEST,
                                  variables: {
                                    ...values,
                                    recaptchaResponse,
                                  },
                                });

                                this.setState({
                                  formMsg: {
                                    color: 'success',
                                    text: `If an account matches with provided email address (${
                                      values.email
                                    }), you should receive an email with instruction on how to reset your password shortly.`,
                                  },
                                });

                                formikBag.resetForm();
                              } catch (e) {
                                const err = transformApolloErr(e);

                                if (err.type === 'BAD_USER_INPUT') {
                                  formikBag.setErrors(err.data);
                                }

                                this.setState({
                                  formMsg: {
                                    color: 'danger',
                                    text: err.message,
                                  },
                                });
                              }

                              this.resetCaptcha();
                              formikBag.setSubmitting(false);
                            }}
                          >
                            {({ isSubmitting, submitForm }) => (
                              <Form>
                                <Field
                                  component={ReactstrapInput}
                                  name="email"
                                  type="email"
                                  label="Email address"
                                  autoComplete="email"
                                  autoFocus
                                  required
                                />
                                <PasswordResetText>
                                  <small className="text-muted">
                                    Password reset instructions will be sent to
                                    this email address.
                                  </small>
                                </PasswordResetText>

                                <Row className="flex-nowrap">
                                  <Col
                                    md="6"
                                    className="align-self-center float-left"
                                  >
                                    <Link to="/auth/login">
                                      <FontAwesomeIcon
                                        icon={faChevronLeft}
                                        size="lg"
                                      />
                                      <span className="ml-2">Login page</span>
                                    </Link>
                                  </Col>
                                  <Col md="6">
                                    <Button
                                      type="submit"
                                      size="lg"
                                      disabled={isSubmitting}
                                      className="btn-theme float-right"
                                    >
                                      <FontAwesomeIcon
                                        pulse
                                        icon={faSpinner}
                                        className={
                                          isSubmitting ? 'mr-2' : 'd-none'
                                        }
                                      />
                                      Reset
                                    </Button>

                                    <Reaptcha
                                      // eslint-disable-next-line
                                      ref={e => (this.captcha = e)}
                                      sitekey={RECAPTCHA_SITE_KEY}
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
                                  </Col>
                                </Row>
                              </Form>
                            )}
                          </Formik>
                        )}
                      </ApolloConsumer>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </Fragment>
    );
  }
}
