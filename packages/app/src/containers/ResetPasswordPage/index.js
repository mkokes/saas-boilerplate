/**
 *
 * ResetPasswordPage
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
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
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { ReactstrapInput } from 'utils/formiik';
import { ApolloConsumer } from 'react-apollo';

import { ResetPassword } from 'graphql/mutations';
import { transformApolloErr } from 'utils/apollo';
import { equalTo } from 'utils/yup';

Yup.addMethod(Yup.string, 'equalTo', equalTo);

/* eslint-disable react/prefer-stateless-function */
export default class ResetPasswordPage extends React.PureComponent {
  constructor(props) {
    super(props);

    const { location } = props;
    const urlParams = queryString.parse(location.search);

    const { token } = urlParams;

    this.state = {
      gotResetTokenFromUrl: token || '',
      formMsg: null,
      hideForm: false,
      hideForgotPasswordPrompt: true,
      hideLogInPrompt: true,
    };
  }

  render() {
    const {
      gotResetTokenFromUrl,
      formMsg,
      hideForm,
      hideForgotPasswordPrompt,
      hideLogInPrompt,
    } = this.state;

    return (
      <Fragment>
        <Helmet>
          <title>Set a New Password</title>
          <meta name="robots" content="noindex, follow" />
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
                  <Row hidden={hideForm}>
                    <Col>
                      <ApolloConsumer>
                        {client => (
                          <Formik
                            initialValues={{
                              resetToken: gotResetTokenFromUrl,
                              newPassword: '',
                              confirmNewPassword: '',
                            }}
                            validationSchema={Yup.object().shape({
                              newPassword: Yup.string().required('Required'),
                              confirmNewPassword: Yup.string()
                                .equalTo(
                                  Yup.ref('newPassword'),
                                  'Password does not match',
                                )
                                .required('Required'),
                            })}
                            onSubmit={async (values, formikBag) => {
                              this.setState({ formMsg: null });

                              try {
                                await client.mutate({
                                  mutation: ResetPassword,
                                  variables: {
                                    resetToken: values.resetToken,
                                    newPassword: values.newPassword,
                                  },
                                });

                                formikBag.setSubmitting(false);

                                this.setState({
                                  formMsg: {
                                    color: 'success',
                                    text:
                                      'Password has been reset. Now you can log in.',
                                  },
                                  hideLogInPrompt: false,
                                });

                                this.setState({ hideForm: true });
                              } catch (e) {
                                const err = transformApolloErr(e);

                                if (err.type === 'BAD_USER_INPUT') {
                                  formikBag.setErrors(err.data);
                                }
                                if (
                                  err.type === 'INVALID_PASSWORD_RESET_TOKEN'
                                ) {
                                  this.setState({ hideForm: true });
                                  this.setState({
                                    hideForgotPasswordPrompt: false,
                                  });
                                }

                                this.setState({
                                  formMsg: {
                                    color: 'danger',
                                    text: err.message,
                                  },
                                });
                                formikBag.setSubmitting(false);
                              }
                            }}
                          >
                            {({ isSubmitting }) => (
                              <Form>
                                <div hidden={gotResetTokenFromUrl}>
                                  <Field
                                    component={ReactstrapInput}
                                    name="resetToken"
                                    type="text"
                                    label="Reset token"
                                    placeholder="(check received reset instructions email)"
                                    autoComplete="off"
                                  />
                                </div>
                                <Field
                                  component={ReactstrapInput}
                                  name="newPassword"
                                  type="password"
                                  label="New password"
                                  autoComplete="new-password"
                                />
                                <Field
                                  component={ReactstrapInput}
                                  name="confirmNewPassword"
                                  type="password"
                                  label="Confirm password"
                                  autoComplete="new-password"
                                />
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
                                    Reset
                                  </Button>
                                </div>
                              </Form>
                            )}
                          </Formik>
                        )}
                      </ApolloConsumer>
                    </Col>
                  </Row>
                  <Row hidden={hideForgotPasswordPrompt}>
                    <Col className="text-center">
                      <Link to="/auth/forgot-password">
                        <Button className="btn-theme">
                          Request new password link
                        </Button>
                      </Link>
                    </Col>
                  </Row>
                  <Row hidden={hideLogInPrompt}>
                    <Col className="text-center">
                      <Link to="/auth/login">
                        <Button className="btn-theme">Go to login page</Button>
                      </Link>
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

ResetPasswordPage.propTypes = {
  location: PropTypes.object,
};
