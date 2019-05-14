/**
 *
 * SupportPage
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
import { ReactstrapInput, ReactstrapSelect } from 'utils/formiik';
import Reaptcha from 'reaptcha';
import _ from 'lodash';
import queryString from 'query-string';

import { GlobalConsumer } from 'GlobalState';
import { CONTACT_SUPPORT } from 'graphql/mutations';
import config from 'config';
import SafeMutation from 'components/graphql/SafeMutation';

const { RECAPTCHA_SITE_KEY, WEBSITE_URL } = config;

/* eslint-disable react/prefer-stateless-function */
export default class SupportPage extends React.PureComponent {
  constructor(props) {
    super(props);

    const { location } = props;
    const urlParams = queryString.parse(location.search);
    const { subject, ticketType } = urlParams;

    this.TICKET_TYPE_OPTIONS = [
      {
        label: 'Question',
        value: 'QUESTION',
      },
      {
        label: 'Problem',
        value: 'PROBLEM',
      },
      {
        label: 'Billing',
        value: 'BILLING',
      },
      {
        label: 'Lost 2FA',
        value: 'LOST_2FA',
      },
      {
        label: 'Bug Report',
        value: 'BUG_REPORT',
      },
      {
        label: 'Feature Request',
        value: 'FEATURE_REQUEST',
      },
    ];

    this.state = {
      subject: subject || '',
      ticketType:
        this.TICKET_TYPE_OPTIONS.find(e => e.value === ticketType) || null,
      ticketOptions: this.TICKET_TYPE_OPTIONS,
    };
  }

  render() {
    const { subject, ticketType, ticketOptions } = this.state;

    return (
      <Fragment>
        <Helmet>
          <title>Contact Support</title>
        </Helmet>

        <Container tag="main">
          <Row>
            <Col md={{ size: 6, offset: 3 }}>
              <GlobalConsumer>
                {({ userProfile }) => (
                  <Fragment>
                    <Card>
                      <CardHeader>
                        <h3 className="mb-0">Contact Support</h3>
                      </CardHeader>
                      <CardBody>
                        <Row>
                          <Col>
                            <SafeMutation mutation={CONTACT_SUPPORT} showError>
                              {contactSupportRequest => (
                                <ContactForm
                                  userProfile={userProfile}
                                  contactSupportRequest={contactSupportRequest}
                                  ticketOptions={ticketOptions}
                                  data={{
                                    initialValues: {
                                      subject,
                                      ticketType,
                                    },
                                  }}
                                />
                              )}
                            </SafeMutation>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                    <div className="mt-5 mb-5 text-center">
                      {userProfile ? (
                        <Link to="/dashboard">
                          <FontAwesomeIcon icon={faChevronLeft} size="lg" />{' '}
                          Return to the dashboard
                        </Link>
                      ) : (
                        <a href={WEBSITE_URL}>
                          <FontAwesomeIcon icon={faChevronLeft} size="lg" />{' '}
                          Return to the homepage
                        </a>
                      )}
                    </div>
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
SupportPage.propTypes = {
  location: PropTypes.object,
};

const ContactForm = props => {
  const { userProfile, contactSupportRequest, ticketOptions, data } = props;

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
        ...data.initialValues,
        requesterName: userProfile ? userProfile.firstName : '',
        requesterEmail: userProfile ? userProfile.email : '',
        description: '',
      }}
      validationSchema={Yup.object().shape({
        requesterName: Yup.string().required('Required'),
        requesterEmail: Yup.string()
          .email('Invalid email')
          .required('Required'),
        subject: Yup.string()
          .max(33)
          .required('Required'),
        ticketType: Yup.object()
          .nullable()
          .shape({
            label: Yup.string().required(),
            value: Yup.string().required(),
          })
          .required('Select an option'),
        description: Yup.string()
          .min(40)
          .required('Required'),
      })}
      onSubmit={async (values, formikBag) => {
        if (!captchaRendered) await captcha.current.renderExplicitly();
        if (!captchaResponse) {
          await captcha.current.execute();
          return setTimeout(() => formikBag.setSubmitting(false), 4000);
        }

        try {
          await contactSupportRequest({
            mutation: CONTACT_SUPPORT,
            variables: {
              ..._.omit(values, ['ticketType']),
              ticketType: values.ticketType.value,
              recaptchaResponse: captchaResponse,
            },
          });

          return setShowSuccessMessage(true);
        } catch (e) {
          if (e.name === 'apollo_link_error' && e.type === 'BAD_USER_INPUT') {
            formikBag.setErrors(e.data);
          }

          await resetCaptcha();
          return formikBag.setSubmitting(false);
        }
      }}
    >
      {({ submitForm, values, isSubmitting }) => (
        <div>
          <Alert
            color="success"
            role="alert"
            fade={false}
            className="text-center"
            hidden={!showSuccessMessage}
          >
            <strong>Thanks for contacting us.</strong>
          </Alert>
          <Form hidden={showSuccessMessage}>
            <Field
              component={ReactstrapInput}
              name="requesterName"
              type="text"
              label="Name"
              autoComplete="first-name"
              disabled={!!userProfile}
              required
            />
            <Field
              component={ReactstrapInput}
              name="requesterEmail"
              type="email"
              label="Email address"
              autoComplete="email"
              disabled={!!userProfile}
              required
            />
            <Field
              component={ReactstrapSelect}
              name="ticketType"
              label="Topic"
              options={ticketOptions}
              value={values.ticketType}
              required
            />
            <Field
              component={ReactstrapInput}
              name="subject"
              type="text"
              label="Subject"
              required
            />
            <Field
              component={ReactstrapInput}
              name="description"
              type="textarea"
              label="Description"
              style={{ height: 150 }}
              required
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
                  className={isSubmitting ? 'mr-2' : 'd-none'}
                />
                Submit
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
ContactForm.propTypes = {
  userProfile: PropTypes.object,
  contactSupportRequest: PropTypes.func,
  ticketOptions: PropTypes.array,
  data: PropTypes.object,
};
