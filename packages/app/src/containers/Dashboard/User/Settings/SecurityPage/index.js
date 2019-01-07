/**
 *
 * SecurityPage
 *
 */

import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet';

import {
  Row,
  Col,
  Card,
  Button,
  Alert,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { ApolloConsumer } from 'react-apollo';
import { toast } from 'react-toastify';
import QRCode from 'qrcode.react';

import { GlobalConsumer } from 'GlobalState';
import { ReactstrapInput } from 'utils/formiik';
import {
  RequestEnable2FA,
  ConfirmEnable2FA,
  Disable2F,
} from 'graphql/mutations';
import { transformApolloErr } from 'utils/apollo';

/* eslint-disable react/prefer-stateless-function */
export default class SecurityPage extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      secret2FA: null,
      qrcode2FA: null,
      is2FAEnableBtnDisabled: false,
      disable2FAModal: false,
    };

    this.toggleDisable2FAModal = this.toggleDisable2FAModal.bind(this);
  }

  toggleDisable2FAModal() {
    this.setState(prevState => ({
      disable2FAModal: !prevState.disable2FAModal,
    }));
  }

  render() {
    const { secret2FA, qrcode2FA, is2FAEnableBtnDisabled } = this.state;

    return (
      <Fragment>
        <Helmet>
          <title>SecurityPage</title>
          <meta name="description" content="Description of SecurityPage" />
        </Helmet>
        <ApolloConsumer>
          {client => (
            <GlobalConsumer>
              {({ setUserProfile, userProfile }) => (
                <Fragment>
                  <h1 className="mb-3">Account Security</h1>
                  <Card body>
                    <legend>
                      2FA Login (Status:{' '}
                      <span
                        className={
                          userProfile.isTwoFactorAuthenticationEnabled
                            ? 'text-success'
                            : 'text-danger'
                        }
                      >
                        {userProfile.isTwoFactorAuthenticationEnabled
                          ? 'Activated'
                          : 'Not in use'}
                      </span>
                      )
                    </legend>
                    <Row>
                      <Col xs="12">
                        <p>
                          Two-Factor Authentication (2FA) can be used to help
                          protect your account from unauthorized access by
                          requiring you to enter an additional code when you
                          sign in.
                        </p>
                        <p>
                          We recommend the use of{' '}
                          <a href="https://support.google.com/accounts/answer/1066447?hl=en">
                            Google Authenticator
                          </a>{' '}
                          mobile application.
                        </p>
                      </Col>
                      <Col className="text-center">
                        {userProfile.isTwoFactorAuthenticationEnabled ? (
                          <Fragment>
                            <Button
                              color="danger"
                              size="lg"
                              onClick={this.toggleDisable2FAModal}
                            >
                              Disable 2FA
                            </Button>
                            <Modal
                              isOpen={this.state.disable2FAModal}
                              toggle={this.toggleDisable2FAModal}
                            >
                              <ModalHeader toggle={this.toggleDisable2FAModal}>
                                Disable 2-Step Verification
                              </ModalHeader>

                              <Formik
                                initialValues={{
                                  token: '',
                                }}
                                validationSchema={Yup.object().shape({
                                  token: Yup.string().required('Required'),
                                })}
                                onSubmit={async (values, formikBag) => {
                                  const { token } = values;

                                  try {
                                    await client.mutate({
                                      mutation: Disable2F,
                                      variables: {
                                        token,
                                      },
                                    });

                                    const _userProfile = userProfile;
                                    _userProfile.isTwoFactorAuthenticationEnabled = false;
                                    setUserProfile(_userProfile);

                                    formikBag.resetForm();
                                    this.setState({
                                      disable2FAModal: false,
                                    });

                                    toast.success('2FA disabled!', {
                                      position: toast.POSITION.TOP_CENTER,
                                    });
                                  } catch (e) {
                                    const err = transformApolloErr(e);

                                    if (err.type === 'BAD_USER_INPUT') {
                                      formikBag.setErrors(err.data);
                                      formikBag.setSubmitting(false);
                                    } else {
                                      this.setState({
                                        disable2FAModal: false,
                                      });
                                      formikBag.resetForm();

                                      toast.error(`ERROR: ${err.message}`, {
                                        position: toast.POSITION.TOP_CENTER,
                                        autoClose: 4000,
                                      });
                                    }
                                  }
                                }}
                              >
                                {({ isSubmitting }) => (
                                  <Fragment>
                                    <Form>
                                      <ModalBody>
                                        <Field
                                          component={ReactstrapInput}
                                          name="token"
                                          label="Enter the 2-step verification code provided by your authentication app:"
                                          type="text"
                                          autoComplete="off"
                                          required
                                        />
                                      </ModalBody>
                                      <ModalFooter>
                                        <Button
                                          color="secondary"
                                          size="lg"
                                          onClick={this.toggleDisable2FAModal}
                                        >
                                          Cancel
                                        </Button>{' '}
                                        <Button
                                          type="submit"
                                          size="lg"
                                          color="primary"
                                          disabled={isSubmitting}
                                        >
                                          <FontAwesomeIcon
                                            pulse
                                            icon={faSpinner}
                                            className={
                                              isSubmitting ? 'mr-2' : 'd-none'
                                            }
                                          />
                                          Disable
                                        </Button>
                                      </ModalFooter>
                                    </Form>
                                  </Fragment>
                                )}
                              </Formik>
                            </Modal>
                          </Fragment>
                        ) : (
                          <Fragment>
                            <Button
                              color="success"
                              size="lg"
                              onClick={async () => {
                                this.setState({
                                  is2FAEnableBtnDisabled: true,
                                });

                                try {
                                  const {
                                    data: {
                                      requestEnable2FA: { secret, qrcode },
                                    },
                                  } = await client.mutate({
                                    mutation: RequestEnable2FA,
                                  });
                                  this.setState({
                                    secret2FA: secret,
                                    qrcode2FA: qrcode,
                                  });
                                } catch (e) {
                                  const err = transformApolloErr(e);

                                  toast.error(err.message, {
                                    position: toast.POSITION.TOP_CENTER,
                                  });
                                  this.setState({
                                    is2FAEnableBtnDisabled: false,
                                  });
                                }
                              }}
                              disabled={is2FAEnableBtnDisabled}
                            >
                              Enable 2FA
                            </Button>

                            {secret2FA && (
                              <Fragment>
                                <Alert color="secondary" className="mt-3">
                                  <Row>
                                    <Col xs="12">
                                      <span>Your secret code is: </span>
                                      <h4>{secret2FA}</h4>
                                      <p style={{ fontSize: 14 }}>
                                        Be sure to backup it! If you lose it,
                                        the process to unlock your account
                                        requires considerable time and
                                        verification.
                                      </p>
                                    </Col>
                                    <Col xs="12">
                                      <QRCode
                                        value={qrcode2FA}
                                        className="mt-3 mb-3"
                                        size={196}
                                      />
                                      <p>
                                        Scan the QR code with the authenticator
                                        app
                                      </p>
                                    </Col>
                                    <Col sm={{ size: 8, offset: 2 }}>
                                      <Formik
                                        initialValues={{
                                          password: '',
                                          token: '',
                                        }}
                                        validationSchema={Yup.object().shape({
                                          password: Yup.string().required(
                                            'Required',
                                          ),
                                          token: Yup.string().required(
                                            'Required',
                                          ),
                                        })}
                                        /* eslint-disable-next-line consistent-return */
                                        onSubmit={async (values, formikBag) => {
                                          const { password, token } = values;

                                          try {
                                            await client.mutate({
                                              mutation: ConfirmEnable2FA,
                                              variables: {
                                                password,
                                                token,
                                              },
                                            });

                                            const _userProfile = userProfile;
                                            _userProfile.isTwoFactorAuthenticationEnabled = true;
                                            setUserProfile(_userProfile);

                                            toast.success(
                                              'Your account is now protected by 2FA!',
                                              {
                                                position:
                                                  toast.POSITION.TOP_CENTER,
                                                autoClose: 3500,
                                              },
                                            );

                                            formikBag.setSubmitting(false);
                                          } catch (e) {
                                            const err = transformApolloErr(e);

                                            if (err.type === 'BAD_USER_INPUT') {
                                              formikBag.setErrors(err.data);
                                            } else {
                                              toast.error(err.message, {
                                                position:
                                                  toast.POSITION.TOP_CENTER,
                                              });
                                            }

                                            formikBag.setSubmitting(false);
                                          }
                                        }}
                                      >
                                        {({ isSubmitting }) => (
                                          <Fragment>
                                            <Form
                                              style={{ textAlign: 'start' }}
                                              className="mt-4"
                                            >
                                              <Field
                                                component={ReactstrapInput}
                                                name="password"
                                                label="Enter your account password (security verification):"
                                                type="password"
                                                autoComplete="current-password"
                                                required
                                              />
                                              <Field
                                                component={ReactstrapInput}
                                                name="token"
                                                label="Enter your six-digit secret code (authenticator app)"
                                                type="text"
                                                autoComplete="off"
                                                required
                                              />

                                              <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="float-right mt-2"
                                              >
                                                <FontAwesomeIcon
                                                  pulse
                                                  icon={faSpinner}
                                                  className={
                                                    isSubmitting
                                                      ? 'mr-2'
                                                      : 'd-none'
                                                  }
                                                />
                                                Enable Two-Factor Authentication
                                              </Button>
                                            </Form>
                                          </Fragment>
                                        )}
                                      </Formik>
                                    </Col>
                                  </Row>
                                </Alert>
                              </Fragment>
                            )}
                          </Fragment>
                        )}
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

SecurityPage.propTypes = {};
