/**
 *
 * SecurityPage
 *
 */

import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet';
// import PropTypes from 'prop-types';
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
import { toast } from 'react-toastify';
import QRCode from 'qrcode.react';

import { GlobalConsumer } from 'GlobalState';
import { ReactstrapInput } from 'utils/formiik';
import {
  REQUEST_ENABLE_2FA,
  CONFIRM_ENABLE_2FA,
  DISABLE_2FA,
} from 'graphql/mutations';
import SafeMutation from 'components/graphql/SafeMutation';

/* eslint-disable react/prefer-stateless-function */
export default class SecurityPage extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      secret2FA: null,
      qrcode2FA: '',
      disable2FAEnableButton: false,
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
    const { secret2FA, qrcode2FA, disable2FAEnableButton } = this.state;

    return (
      <Fragment>
        <Helmet>
          <title>Account security</title>
        </Helmet>
        <GlobalConsumer>
          {({ setUserProfile, userProfile }) => (
            <Fragment>
              <h1 className="mb-3">Account Security</h1>
              <Card body>
                <legend>
                  2FA Login (Status:{' '}
                  <span
                    className={
                      userProfile.hasTwoFactorAuthenticationEnabled
                        ? 'text-success'
                        : 'text-muted'
                    }
                  >
                    {userProfile.hasTwoFactorAuthenticationEnabled
                      ? 'Activated'
                      : 'Not activated'}
                  </span>
                  )
                </legend>
                <Row>
                  <Col xs="12">
                    <p>
                      <strong>Two-Factor Authentication (2FA)</strong> can be
                      used to help protect your account from unauthorized access
                      by requiring you to enter an additional code when you sign
                      in.
                    </p>
                    <p>
                      We recommend the use of{' '}
                      <a
                        href="https://support.google.com/accounts/answer/1066447?hl=en"
                        target="_new"
                      >
                        Google Authenticator
                      </a>{' '}
                      mobile application to use this feature.
                    </p>
                  </Col>
                  <Col
                    className="text-center"
                    hidden={userProfile.hasTwoFactorAuthenticationEnabled}
                  >
                    <SafeMutation mutation={REQUEST_ENABLE_2FA}>
                      {(requestEnable2FA, { loading }) => (
                        <Button
                          size="lg"
                          onClick={async () => {
                            this.setState({
                              disable2FAEnableButton: true,
                            });

                            try {
                              const {
                                data: {
                                  requestEnable2FA: { secret, qrcode },
                                },
                              } = await requestEnable2FA();

                              this.setState({
                                secret2FA: secret,
                                qrcode2FA: qrcode,
                              });
                              window.scrollTo(0, document.body.scrollHeight);
                            } catch (e) {
                              toast.error(e.message, {
                                position: toast.POSITION.TOP_CENTER,
                              });
                              this.setState({
                                disable2FAEnableButton: false,
                              });
                            }
                          }}
                          disabled={disable2FAEnableButton}
                        >
                          <FontAwesomeIcon
                            pulse
                            icon={faSpinner}
                            className="mr-2"
                            hidden={!loading}
                          />
                          Enable 2FA
                        </Button>
                      )}
                    </SafeMutation>
                    {secret2FA && (
                      <Alert color="warning" className="mt-3">
                        <Row>
                          <Col xs="12">
                            <span>Your secret code is: </span>
                            <h4>{secret2FA}</h4>
                            <p style={{ fontSize: 14 }}>
                              Please, be sure to backup it. If you lose it, the
                              process to unlock your account requires
                              considerable time and verification.
                            </p>
                          </Col>
                          <Col xs="12">
                            <QRCode
                              value={qrcode2FA}
                              className="mt-3 mb-3"
                              size={196}
                            />
                            <p>
                              <strong>
                                Scan this QR code with the authenticator app
                              </strong>
                            </p>
                          </Col>
                          <Col sm={{ size: 8, offset: 2 }}>
                            <SafeMutation mutation={CONFIRM_ENABLE_2FA}>
                              {confirmEnable2FA => (
                                <Formik
                                  initialValues={{
                                    password: '',
                                    token: '',
                                  }}
                                  validationSchema={Yup.object().shape({
                                    password: Yup.string().required('Required'),
                                    token: Yup.string().required('Required'),
                                  })}
                                  onSubmit={async (values, formikBag) => {
                                    const { password, token } = values;

                                    try {
                                      await confirmEnable2FA({
                                        variables: {
                                          password,
                                          token,
                                        },
                                      });

                                      const _userProfile = userProfile;
                                      _userProfile.hasTwoFactorAuthenticationEnabled = true;
                                      setUserProfile(_userProfile);

                                      toast.success(
                                        'Your account is now protected by 2FA.',
                                        {
                                          position: toast.POSITION.TOP_CENTER,
                                          autoClose: 3500,
                                        },
                                      );
                                    } catch (e) {
                                      if (
                                        e.name === 'apollo_link_error' &&
                                        e.type === 'BAD_USER_INPUT'
                                      ) {
                                        formikBag.setErrors(e.data);
                                      } else {
                                        toast.error(e.message, {
                                          position: toast.POSITION.TOP_CENTER,
                                        });
                                      }
                                    }
                                    formikBag.setSubmitting(false);
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
                                          label="Enter generated 2FA code:"
                                          type="text"
                                          autoComplete="off"
                                          required
                                        />

                                        <Button
                                          type="submit"
                                          disabled={isSubmitting}
                                          className="float-right mt-2"
                                          color="primary"
                                        >
                                          <FontAwesomeIcon
                                            pulse
                                            icon={faSpinner}
                                            className="mr-2"
                                            hidden={!isSubmitting}
                                          />
                                          Enable Two-Factor Authentication
                                        </Button>
                                      </Form>
                                    </Fragment>
                                  )}
                                </Formik>
                              )}
                            </SafeMutation>
                          </Col>
                        </Row>
                      </Alert>
                    )}
                  </Col>
                  <Col
                    className="text-center"
                    hidden={!userProfile.hasTwoFactorAuthenticationEnabled}
                  >
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

                      <SafeMutation mutation={DISABLE_2FA}>
                        {disable2FA => (
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
                                await disable2FA({
                                  variables: {
                                    token,
                                  },
                                });

                                const _userProfile = userProfile;
                                _userProfile.hasTwoFactorAuthenticationEnabled = false;
                                setUserProfile(_userProfile);

                                formikBag.resetForm();
                                this.setState({
                                  secret2FA: null,
                                  qrcode2FA: '',
                                  disable2FAEnableButton: false,
                                  disable2FAModal: false,
                                });

                                toast.success('2FA is now disabled.', {
                                  position: toast.POSITION.TOP_CENTER,
                                });
                              } catch (e) {
                                if (
                                  e.name === 'apollo_link_error' &&
                                  e.type === 'BAD_USER_INPUT'
                                ) {
                                  formikBag.setErrors(e.data);
                                  formikBag.setSubmitting(false);
                                } else {
                                  this.setState({
                                    disable2FAModal: false,
                                  });
                                  formikBag.resetForm();

                                  toast.error(e.message, {
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
                                      label="Enter Two-factor authentication code (security confirmation):"
                                      type="text"
                                      autoComplete="off"
                                      required
                                    />
                                  </ModalBody>
                                  <ModalFooter>
                                    <Button
                                      type="submit"
                                      size="lg"
                                      color="secondary"
                                      disabled={isSubmitting}
                                    >
                                      <FontAwesomeIcon
                                        pulse
                                        icon={faSpinner}
                                        className="mr-2"
                                        hidden={!isSubmitting}
                                      />
                                      Disable
                                    </Button>
                                  </ModalFooter>
                                </Form>
                              </Fragment>
                            )}
                          </Formik>
                        )}
                      </SafeMutation>
                    </Modal>
                  </Col>
                </Row>
              </Card>
            </Fragment>
          )}
        </GlobalConsumer>
      </Fragment>
    );
  }
}
