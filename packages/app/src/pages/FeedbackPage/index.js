/**
 *
 * FeedbackPage
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { ReactstrapInput } from 'utils/formiik';
import Reaptcha from 'reaptcha';

import { GlobalConsumer } from 'GlobalState';
import { SEND_FEEDBACK } from 'graphql/mutations';
import config from 'config';
import SafeMutation from 'components/SafeMutation';

const { RECAPTCHA_SITE_KEY } = config;

/* eslint-disable react/prefer-stateless-function */
export default class FeedbackPage extends React.PureComponent {
  render() {
    return (
      <Fragment>
        <Helmet>
          <title>Feedback</title>
        </Helmet>
        <Container tag="main">
          <Row>
            <Col md={{ size: 6, offset: 3 }}>
              <GlobalConsumer>
                {({ userProfile }) => (
                  <Fragment>
                    <Card>
                      <CardHeader>
                        <h3 className="mb-0">Feedback</h3>
                      </CardHeader>
                      <CardBody>
                        <Row>
                          <Col>
                            <SafeMutation mutation={SEND_FEEDBACK} showError>
                              {sendFeedbackRequest => (
                                <FeedbackForm
                                  userProfile={userProfile}
                                  sendFeedbackRequest={sendFeedbackRequest}
                                />
                              )}
                            </SafeMutation>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </Fragment>
                )}
              </GlobalConsumer>
            </Col>
          </Row>
        </Container>
      </Fragment>
    );
  }
}

FeedbackPage.propTypes = {};

const FeedbackForm = props => {
  const { userProfile, sendFeedbackRequest } = props;

  const [captchaRendered, setCaptchaRendered] = useState(false);
  const [captchaResponse, setCaptchaResponse] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const resetCaptcha = async () => {
    setCaptchaResponse('');
    try {
      await captcha.current.reset();
      // eslint-disable-next-line no-empty
    } catch (__) {}
  };

  const captcha = useRef(null);

  return (
    <Formik
      initialValues={{
        text: '',
        email: userProfile ? userProfile.email : '',
      }}
      validationSchema={Yup.object().shape({
        text: Yup.string()
          .min(10, 'Too short!')
          .required('Required'),
        email: Yup.string().email('Invalid email'),
      })}
      onSubmit={async (values, formikBag) => {
        setShowSuccessMessage(false);

        if (!captchaRendered) await captcha.current.renderExplicitly();
        if (!captchaResponse) {
          await captcha.current.execute();
          return setTimeout(() => formikBag.setSubmitting(false), 4000);
        }

        try {
          await sendFeedbackRequest({
            mutation: SEND_FEEDBACK,
            variables: {
              ...values,
              recaptchaResponse: captchaResponse,
            },
          });

          formikBag.resetForm();
          setShowSuccessMessage(true);
        } catch (e) {
          if (e.name === 'apollo_link_error' && e.type === 'BAD_USER_INPUT') {
            formikBag.setErrors(e.data);
          }

          formikBag.setSubmitting(false);
        }

        return resetCaptcha();
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
            <strong>Your feedback was sent, thank you.</strong>
          </Alert>
          <Form>
            <p className="text-muted mb-0">
              Please share your thoughts, concerns..etc so PRODUCT_NAME can
              improve!
            </p>
            <Field
              component={ReactstrapInput}
              name="text"
              type="textarea"
              style={{ height: 150 }}
              required
            />
            <div hidden={userProfile}>
              <Field
                component={ReactstrapInput}
                name="email"
                type="email"
                label="Your email (optional)"
                placeholder="example@email.com"
                autoComplete="email"
                required
              />
            </div>
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
                  className="mr-2"
                  hidden={!isSubmitting}
                />
                Send feedback
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
            </div>
          </Form>
        </div>
      )}
    </Formik>
  );
};
FeedbackForm.propTypes = {
  userProfile: PropTypes.object,
  sendFeedbackRequest: PropTypes.func,
};
