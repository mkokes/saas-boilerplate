/**
 *
 * ForgotPasswordPage
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
import { faSpinner, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import { ReactstrapInput } from 'utils/formiik';
import { ApolloConsumer } from 'react-apollo';

import { ForgotPassword } from 'graphql/mutations';
import { transformApolloErr } from 'utils/apollo';

const PasswordResetText = styled('div')`
  margin-top: -15px;
  margin-bottom: 20px;
`;

/* eslint-disable react/prefer-stateless-function */
export default class ForgotPasswordPage extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      formMsg: null,
    };
  }

  render() {
    const { formMsg } = this.state;

    return (
      <Fragment>
        <Helmet>
          <title>Forgot password</title>
          <meta
            name="description"
            content="Description of ForgotPasswordPage"
          />
        </Helmet>
        <Container tag="main">
          <Row>
            <Col md={{ size: 6, offset: 3 }}>
              <Card>
                <CardHeader>
                  <h3 className="mb-0">Password Reset</h3>
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

                              try {
                                await client.mutate({
                                  mutation: ForgotPassword,
                                  variables: {
                                    ...values,
                                  },
                                });

                                formikBag.setSubmitting(false);
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
                                      <span className="ml-2">
                                        Back to Login
                                      </span>
                                    </Link>
                                  </Col>
                                  <Col md="6">
                                    <Button
                                      type="submit"
                                      size="lg"
                                      color="success"
                                      disabled={isSubmitting}
                                      className="float-right"
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
