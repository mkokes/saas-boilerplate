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
import { Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { ReactstrapInput } from 'reactstrap-formik';
import { ApolloConsumer } from 'react-apollo';

import { GlobalConsumer } from 'GlobalState';
import { ResetPassword } from 'graphql/mutations';
import { transformApolloErr } from 'utils/apollo';

// @TODO: Export this to utils
function equalTo(ref, msg) {
  return this.test({
    name: 'equalTo',
    exclusive: false,
    /* eslint-disable-next-line no-template-curly-in-string */
    message: msg || '${path} must be the same as ${reference}',
    params: {
      reference: ref.path,
    },
    test(value) {
      return value === this.resolve(ref);
    },
  });
}
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
    };
  }

  render() {
    const { gotResetTokenFromUrl, formMsg } = this.state;

    return (
      <GlobalConsumer>
        {({ loggedIn }) => (
          <Fragment>
            {loggedIn && <Redirect to="/dashboard/index" />}

            <Helmet>
              <title>Reset password</title>
              <meta
                name="description"
                content="Description of ResetPasswordPage"
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
                            <Alert color={formMsg.color} role="alert">
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
                                  resetToken: gotResetTokenFromUrl,
                                  newPassword: '',
                                  confirmNewPassword: '',
                                }}
                                validationSchema={Yup.object().shape({
                                  newPassword: Yup.string().required(
                                    'Required',
                                  ),
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
                                    <div hidden={gotResetTokenFromUrl}>
                                      <Field
                                        component={ReactstrapInput}
                                        name="resetToken"
                                        type="text"
                                        label="Reset token"
                                      />
                                    </div>
                                    <Field
                                      component={ReactstrapInput}
                                      name="newPassword"
                                      type="password"
                                      label="New password"
                                      autoComplete="password"
                                    />
                                    <Field
                                      component={ReactstrapInput}
                                      name="confirmNewPassword"
                                      type="password"
                                      label="Confirm password"
                                    />
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
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Container>
          </Fragment>
        )}
      </GlobalConsumer>
    );
  }
}

ResetPasswordPage.propTypes = {
  location: PropTypes.object,
};
