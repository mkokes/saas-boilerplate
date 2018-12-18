/**
 *
 * ProfilePage
 *
 */

import React, { Fragment } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert,
} from 'reactstrap';
import { Helmet } from 'react-helmet';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { ApolloConsumer } from 'react-apollo';
import { toast } from 'react-toastify';

import { ReactstrapInput } from 'utils/formiik';
import { GlobalConsumer } from 'GlobalState';
import {
  ChangeUserPassword,
  UpdateUserProfile,
  UpdateUserPersonalDetails,
  ChangeUserEmail,
} from 'graphql/mutations';
import { transformApolloErr } from 'utils/apollo';
import Avatar from 'components/Avatar';

// @FIXME: DUPLICATED CODE, CHECK RESETPASSWORDPAGE
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
export default class ProfilePage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      changePasswordErrMsg: '',
      changePasswordModal: false,
    };

    this.toggleChangePasswordModal = this.toggleChangePasswordModal.bind(this);
  }

  toggleChangePasswordModal() {
    this.setState(prevState => ({
      changePasswordModal: !prevState.changePasswordModal,
    }));
  }

  render() {
    const { changePasswordErrMsg } = this.state;

    return (
      <Fragment>
        <Helmet>
          <title>ProfilePage</title>
          <meta name="description" content="Description of ProfilePage" />
        </Helmet>
        <ApolloConsumer>
          {client => (
            <GlobalConsumer>
              {({ setAuthTokens, setUserProfile, userProfile }) => (
                <Fragment>
                  <h1 className="mb-3">My Profile</h1>
                  <Card body>
                    <legend>User Profile</legend>
                    <Row className="align-items-center">
                      <Col xs="auto">
                        <Avatar
                          width="64"
                          height="64"
                          src={`data:image/svg+xml;base64,${
                            userProfile.avatar
                          }`}
                        />
                      </Col>
                      <Col xs="auto">
                        <p
                          style={{
                            fontWeight: 600,
                            fontSize: 14,
                          }}
                          className="mb-0"
                        >
                          Change Picture
                        </p>
                        <p style={{ fontWeight: 200, fontSize: 14 }}>
                          Max file size is 20Mb.
                        </p>
                      </Col>
                      <Col xs="2">
                        <Button disabled>Upload</Button>
                      </Col>
                    </Row>
                    <hr />
                    <Row>
                      <Col xs="12" sm="4">
                        <p
                          style={{
                            fontWeight: 600,
                            fontSize: 14,
                          }}
                          className="mb-0"
                        >
                          Change Password
                        </p>
                        <p style={{ fontWeight: 200, fontSize: 14 }}>
                          Enable 2-factor authentication on{' '}
                          <NavLink to="/dashboard/settings/security">
                            the security page
                          </NavLink>
                          .
                        </p>
                      </Col>
                      <Col sm="2">
                        <Button onClick={this.toggleChangePasswordModal}>
                          Change Password
                        </Button>
                        <Modal
                          isOpen={this.state.changePasswordModal}
                          toggle={this.toggleChangePasswordModal}
                        >
                          <ModalHeader toggle={this.toggleChangePasswordModal}>
                            Change Password
                          </ModalHeader>

                          <Formik
                            initialValues={{
                              oldPassword: '',
                              newPassword: '',
                              confirmNewPassword: '',
                            }}
                            validationSchema={Yup.object().shape({
                              oldPassword: Yup.string().required('Required'),
                              newPassword: Yup.string().required('Required'),
                              confirmNewPassword: Yup.string()
                                .equalTo(
                                  Yup.ref('newPassword'),
                                  'Password does not match',
                                )
                                .required('Required'),
                            })}
                            onSubmit={async (values, formikBag) => {
                              this.setState({
                                changePasswordErrMsg: '',
                              });

                              try {
                                const {
                                  data: {
                                    changeUserPassword: {
                                      accessToken,
                                      refreshToken,
                                    },
                                  },
                                } = await client.mutate({
                                  mutation: ChangeUserPassword,
                                  variables: values,
                                });

                                await setAuthTokens({
                                  accessToken,
                                  refreshToken,
                                });

                                formikBag.resetForm();

                                this.setState({
                                  changePasswordModal: false,
                                });

                                toast.success(
                                  'Your account password has been successfully changed',
                                  {
                                    position: toast.POSITION.TOP_CENTER,
                                  },
                                );
                              } catch (e) {
                                const err = transformApolloErr(e);

                                if (err.type === 'BAD_USER_INPUT') {
                                  formikBag.setErrors(err.data);
                                } else {
                                  this.setState({
                                    changePasswordErrMsg: err.message,
                                  });
                                }

                                formikBag.setSubmitting(false);
                              }
                            }}
                          >
                            {({ isSubmitting }) => (
                              <Fragment>
                                <Form>
                                  <ModalBody>
                                    {changePasswordErrMsg && (
                                      <Alert
                                        color="danger"
                                        role="alert"
                                        fade={false}
                                      >
                                        <strong>
                                          ERROR: {changePasswordErrMsg}
                                        </strong>
                                      </Alert>
                                    )}
                                    <Field
                                      component={ReactstrapInput}
                                      label="Old password"
                                      name="oldPassword"
                                      type="password"
                                      autoComplete="current-password"
                                      required
                                    />
                                    <Field
                                      component={ReactstrapInput}
                                      label="New password"
                                      name="newPassword"
                                      type="password"
                                      autoComplete="new-password"
                                      required
                                    />
                                    <Field
                                      component={ReactstrapInput}
                                      label="Confirm New Password"
                                      name="confirmNewPassword"
                                      type="password"
                                      autoComplete="off"
                                      required
                                    />
                                    <Alert
                                      color="warning"
                                      style={{ fontSize: 15 }}
                                    >
                                      A password change will result in a force
                                      logout on all devices
                                    </Alert>
                                  </ModalBody>
                                  <ModalFooter>
                                    <Button
                                      color="secondary"
                                      size="lg"
                                      onClick={this.toggleChangePasswordModal}
                                    >
                                      Cancel
                                    </Button>{' '}
                                    <Button
                                      type="submit"
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
                                      Change Password
                                    </Button>
                                  </ModalFooter>
                                </Form>
                              </Fragment>
                            )}
                          </Formik>
                        </Modal>
                      </Col>
                    </Row>
                    <hr />
                    <Row>
                      <Col xs="12" sm="4">
                        <p
                          style={{
                            fontWeight: 600,
                            fontSize: 14,
                          }}
                          className="mb-0"
                        >
                          Nick Name
                        </p>
                        <p style={{ fontWeight: 200, fontSize: 14 }}>
                          This name will be part of your public profile.
                        </p>
                      </Col>
                      <Col xs="10" sm="8" lg="6">
                        <Formik
                          initialValues={{
                            nickname: userProfile.nickname,
                          }}
                          validationSchema={Yup.object().shape({
                            nickname: Yup.string().required('Required'),
                          })}
                          /* eslint-disable-next-line consistent-return */
                          onSubmit={async (values, formikBag) => {
                            try {
                              const {
                                data: { profile },
                              } = await client.mutate({
                                mutation: UpdateUserProfile,
                                variables: {
                                  profile: values,
                                },
                              });

                              setUserProfile(profile);

                              formikBag.resetForm();
                              toast.success(`Profile updated!`, {
                                position: toast.POSITION.TOP_CENTER,
                                autoClose: 3000,
                              });
                            } catch (e) {
                              const err = transformApolloErr(e);

                              if (err.type === 'BAD_USER_INPUT') {
                                formikBag.setErrors(err.data);
                              } else {
                                toast.error(err.message, {
                                  position: toast.POSITION.TOP_CENTER,
                                });
                              }

                              formikBag.setSubmitting(false);
                            }
                          }}
                        >
                          {({ isSubmitting }) => (
                            <Fragment>
                              <Form>
                                <Field
                                  component={ReactstrapInput}
                                  name="nickname"
                                  label="Nick name"
                                  type="text"
                                  autoComplete="off"
                                  required
                                />

                                <Button
                                  type="submit"
                                  disabled={isSubmitting}
                                  className="float-right"
                                >
                                  <FontAwesomeIcon
                                    pulse
                                    icon={faSpinner}
                                    className={isSubmitting ? 'mr-2' : 'd-none'}
                                  />
                                  Save
                                </Button>
                              </Form>
                            </Fragment>
                          )}
                        </Formik>
                      </Col>
                    </Row>
                    <hr />
                    <Row>
                      <Col xs="12" sm="4">
                        <p
                          style={{
                            fontWeight: 600,
                            fontSize: 14,
                          }}
                          className="mb-0"
                        >
                          Change Email Address
                        </p>
                        <p style={{ fontWeight: 200, fontSize: 14 }}>
                          An email will be sent to the new email address to
                          confirm the address change.
                        </p>
                      </Col>
                      <Col xs="10" sm="8" lg="6">
                        <Formik
                          initialValues={{
                            email: userProfile.email,
                            password: '',
                          }}
                          validationSchema={Yup.object().shape({
                            email: Yup.string()
                              .email('Invalid email')
                              .required('Required'),
                            password: Yup.string().required('Required'),
                          })}
                          /* eslint-disable-next-line consistent-return */
                          onSubmit={async (values, formikBag) => {
                            if (
                              values.email.toLowerCase().replace(/\s/g, '') ===
                              userProfile.email
                            ) {
                              toast.success('Email address updated!', {
                                position: toast.POSITION.TOP_CENTER,
                              });

                              return formikBag.setSubmitting(false);
                            }

                            try {
                              await client.mutate({
                                mutation: ChangeUserEmail,
                                variables: values,
                              });

                              formikBag.resetForm();

                              toast.success(
                                `We've sent an email to ${
                                  values.email
                                } to confirm your email address. Click the link in that email to make the change effective.`,
                                {
                                  position: toast.POSITION.TOP_CENTER,
                                  autoClose: 8000,
                                },
                              );
                            } catch (e) {
                              const err = transformApolloErr(e);

                              if (err.type === 'BAD_USER_INPUT') {
                                formikBag.setErrors(err.data);
                              } else {
                                toast.error(err.message, {
                                  position: toast.POSITION.TOP_CENTER,
                                });
                              }

                              formikBag.setSubmitting(false);
                            }
                          }}
                        >
                          {({ isSubmitting }) => (
                            <Fragment>
                              <Form>
                                <Field
                                  component={ReactstrapInput}
                                  name="email"
                                  label="Email address"
                                  type="email"
                                  autoComplete="off"
                                  required
                                />
                                <Field
                                  component={ReactstrapInput}
                                  name="password"
                                  label="Current password"
                                  type="password"
                                  autoComplete="current-password"
                                  required
                                />

                                <Button
                                  type="submit"
                                  disabled={isSubmitting}
                                  className="float-right"
                                >
                                  <FontAwesomeIcon
                                    pulse
                                    icon={faSpinner}
                                    className={isSubmitting ? 'mr-2' : 'd-none'}
                                  />
                                  Save
                                </Button>
                              </Form>
                            </Fragment>
                          )}
                        </Formik>
                      </Col>
                    </Row>
                    <legend>Personal Details</legend>
                    <Row>
                      <Col xs="12" sm="4">
                        <p
                          style={{
                            fontWeight: 600,
                            fontSize: 14,
                          }}
                          className="mb-0"
                        >
                          Personal details
                        </p>
                        <p style={{ fontWeight: 200, fontSize: 14 }}>
                          Your personal information is never shown to other
                          users.
                        </p>
                      </Col>
                      <Col xs="10" sm="8" lg="6">
                        <Formik
                          initialValues={{
                            fullName: userProfile.fullName,
                          }}
                          validationSchema={Yup.object().shape({
                            fullName: Yup.string().required('Required'),
                          })}
                          /* eslint-disable-next-line consistent-return */
                          onSubmit={async (values, formikBag) => {
                            try {
                              const {
                                data: { profile },
                              } = await client.mutate({
                                mutation: UpdateUserPersonalDetails,
                                variables: {
                                  profile: values,
                                },
                              });

                              setUserProfile(profile);

                              formikBag.resetForm();
                              toast.success(`Personal details updated!`, {
                                position: toast.POSITION.TOP_CENTER,
                                autoClose: 3000,
                              });
                            } catch (e) {
                              const err = transformApolloErr(e);

                              if (err.type === 'BAD_USER_INPUT') {
                                formikBag.setErrors(err.data);
                              } else {
                                toast.error(err.message, {
                                  position: toast.POSITION.TOP_CENTER,
                                });
                              }

                              formikBag.setSubmitting(false);
                            }
                          }}
                        >
                          {({ isSubmitting }) => (
                            <Fragment>
                              <Form>
                                <Field
                                  component={ReactstrapInput}
                                  name="fullName"
                                  label="Full Name"
                                  type="text"
                                  autoComplete="off"
                                  required
                                />

                                <Button
                                  type="submit"
                                  disabled={isSubmitting}
                                  className="float-right"
                                >
                                  <FontAwesomeIcon
                                    pulse
                                    icon={faSpinner}
                                    className={isSubmitting ? 'mr-2' : 'd-none'}
                                  />
                                  Save
                                </Button>
                              </Form>
                            </Fragment>
                          )}
                        </Formik>
                      </Col>
                    </Row>
                  </Card>
                </Fragment>
              )}
            </GlobalConsumer>
          )}
        </ApolloConsumer>
      </Fragment>
    );
  }
}

ProfilePage.propTypes = {};
