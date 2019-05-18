/**
 *
 * ForgotPasswordPage
 *
 */

import React, { Fragment, useState, useRef } from 'react';
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
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import { ReactstrapInput } from 'utils/formiik';
import Reaptcha from 'reaptcha';
import { toast } from 'react-toastify';

import { FORGOT_PASSWORD_REQUEST } from 'graphql/mutations';
import config from 'config';
import SafeMutation from 'components/SafeMutation';

const PasswordResetText = styled('div')`
  margin-top: -15px;
  margin-bottom: 20px;
`;

const { RECAPTCHA_SITE_KEY } = config;

/* eslint-disable react/prefer-stateless-function */
export default class ForgotPasswordPage extends React.PureComponent {
  render() {
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
                    <Col>
                      <SafeMutation
                        mutation={FORGOT_PASSWORD_REQUEST}
                        showError
                      >
                        {forgotPasswordRequest => (
                          <ForgotPasswordForm
                            forgotPasswordRequest={forgotPasswordRequest}
                          />
                        )}
                      </SafeMutation>
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

const ForgotPasswordForm = props => {
  const { forgotPasswordRequest } = props;

  const [captchaRendered, setCaptchaRendered] = useState(false);
  const [captchaResponse, setCaptchaResponse] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [forgotEmailSentTo, setForgotEmailSentTo] = useState(null);

  const resetCaptcha = async () => {
    setCaptchaResponse('');
    try {
      await captcha.current.reset();
      // eslint-disable-next-line no-empty
    } catch (_) {}
  };

  const captcha = useRef(null);

  return (
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
        setShowSuccessMessage(false);

        if (!captchaRendered) await captcha.current.renderExplicitly();
        if (!captchaResponse) {
          await captcha.current.execute();
          return setTimeout(() => formikBag.setSubmitting(false), 4000);
        }

        try {
          await forgotPasswordRequest({
            mutation: FORGOT_PASSWORD_REQUEST,
            variables: {
              ...values,
              recaptchaResponse: captchaResponse,
            },
          });

          setForgotEmailSentTo(values.email);

          setShowSuccessMessage(true);
          formikBag.resetForm();
        } catch (e) {
          if (e.name === 'apollo_link_error' && e.type === 'BAD_USER_INPUT') {
            formikBag.setErrors(e.data);
          } else {
            toast.error(e.message, {
              position: toast.POSITION.TOP_CENTER,
            });
          }
        }

        await resetCaptcha();
        return formikBag.setSubmitting(false);
      }}
    >
      {({ submitForm, isSubmitting }) => (
        <div>
          <Alert
            color="success"
            role="alert"
            fade={false}
            className="text-center"
            hidden={!showSuccessMessage}
          >
            <strong>
              If an account matches with provided email address (
              {forgotEmailSentTo}
              ), you should receive an email with instruction on how to reset
              your password shortly.
            </strong>
          </Alert>
          <Form>
            <Field
              component={ReactstrapInput}
              name="email"
              type="email"
              label="Email address"
              autoComplete="email"
              required
            />
            <PasswordResetText className="text-muted small">
              Password reset instructions will be sent to this email address.
            </PasswordResetText>

            <Row className="flex-nowrap">
              <Col md="6" className="align-self-center float-left">
                <Link to="/auth/login">
                  <FontAwesomeIcon icon={faChevronLeft} size="lg" />
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
                    className={isSubmitting ? 'mr-2' : 'd-none'}
                  />
                  Reset
                </Button>
                <Reaptcha
                  // eslint-disable-next-line no-return-assign
                  ref={captcha}
                  sitekey={RECAPTCHA_SITE_KEY}
                  size="invisible"
                  explicit
                  onRender={() => setCaptchaRendered(true)}
                  onVerify={res => {
                    setCaptchaResponse(res);
                    submitForm();
                  }}
                  onExpire={async () => {
                    await resetCaptcha();
                  }}
                  onError={async () => {
                    await resetCaptcha();
                  }}
                />
              </Col>
            </Row>
          </Form>
        </div>
      )}
    </Formik>
  );
};
ForgotPasswordForm.propTypes = {
  forgotPasswordRequest: PropTypes.func,
};
