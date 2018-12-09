/**
 *
 * ContactPage
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
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { ApolloConsumer } from 'react-apollo';
import Reaptcha from 'reaptcha';

import { ReactstrapInput } from 'utils/formiik';
import { Contact } from 'graphql/mutations';
import { transformApolloErr } from 'utils/apollo';
import { GlobalConsumer } from 'GlobalState';
import { AnalyticsApi } from 'api/vendors';

/* eslint-disable react/prefer-stateless-function */
export default class ContactPage extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      recaptchaResponse: '',
      formMessage: '',
      hideForm: false,
    };

    this.captcha = null;
  }

  resetCaptcha() {
    this.setState({ recaptchaResponse: '' });
    this.captcha.reset();
  }

  render() {
    const { recaptchaResponse, formMessage, hideForm } = this.state;

    return (
      <GlobalConsumer>
        {({ loggedIn, userProfile }) => (
          <Fragment>
            <Helmet>
              <title>Contact us</title>
              <meta name="description" content="Description of ContactPage" />
            </Helmet>

            <Container
              tag="main"
              className="flex flex-column justify-content-center"
            >
              <Row>
                <Col md={{ size: 6, offset: 3 }}>
                  <Card>
                    <CardHeader>
                      <h3 className="mb-0">Contact form</h3>
                    </CardHeader>
                    <CardBody>
                      {formMessage && (
                        <Row>
                          <Col className="text-center">
                            <Alert
                              color={formMessage.color}
                              role="alert"
                              fade={false}
                            >
                              <strong>{formMessage.text}</strong>
                            </Alert>
                          </Col>
                        </Row>
                      )}
                      <Row hidden={hideForm}>
                        <Col>
                          <ApolloConsumer>
                            {client => (
                              <Formik
                                initialValues={{
                                  name: loggedIn ? userProfile.fullName : '',
                                  email: loggedIn ? userProfile.email : '',
                                  subject: '',
                                  message: '',
                                }}
                                validationSchema={() =>
                                  Yup.object().shape({
                                    name: Yup.string()
                                      .min(2, 'Too short!')
                                      .required('Required'),
                                    email: Yup.string()
                                      .email('Invalid email')
                                      .required('Required'),
                                    subject: Yup.string().required('Required'),
                                    message: Yup.string()
                                      .min(10, 'Message is too short')
                                      .required('Required'),
                                  })
                                }
                                onSubmit={async (values, formikBag) => {
                                  this.setState({
                                    formMessage: null,
                                  });

                                  if (!recaptchaResponse) {
                                    formikBag.setSubmitting(false);
                                    this.captcha.execute();
                                    return;
                                  }

                                  try {
                                    await client.mutate({
                                      mutation: Contact,
                                      variables: {
                                        ...values,
                                        recaptchaResponse,
                                      },
                                    });

                                    formikBag.setSubmitting(false);
                                    formikBag.resetForm();

                                    this.setState({
                                      formMessage: {
                                        color: 'success',
                                        text:
                                          'Thank you for getting in touch, we will contact you as soon as possible.',
                                      },
                                      hideForm: true,
                                    });
                                    AnalyticsApi.track(
                                      'Contact form submission',
                                    );
                                  } catch (e) {
                                    const err = transformApolloErr(e);

                                    if (err.type === 'BAD_USER_INPUT') {
                                      formikBag.setErrors(err.data);
                                    }

                                    this.resetCaptcha();
                                    formikBag.setSubmitting(false);
                                    this.setState({
                                      formMessage: {
                                        color: 'danger',
                                        text: err.message,
                                      },
                                    });
                                  }
                                }}
                              >
                                {({ submitForm, isSubmitting }) => (
                                  <Form>
                                    <Field
                                      component={ReactstrapInput}
                                      name="name"
                                      type="text"
                                      label="Name"
                                      autoComplete="name"
                                      required
                                    />
                                    <Field
                                      component={ReactstrapInput}
                                      name="email"
                                      type="email"
                                      label="Email address"
                                      autoComplete="email"
                                      required
                                    />
                                    <Field
                                      component={ReactstrapInput}
                                      name="subject"
                                      type="text"
                                      label="Subject"
                                      autoComplete="off"
                                      required
                                    />
                                    <Field
                                      component={ReactstrapInput}
                                      name="message"
                                      type="textarea"
                                      label="How can we help?"
                                    />

                                    <Button
                                      type="submit"
                                      block
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
                                      Get in touch
                                    </Button>

                                    <Reaptcha
                                      // eslint-disable-next-line
                                      ref={e => (this.captcha = e)}
                                      sitekey={
                                        process.env.REACT_APP_RECAPTCHA_SITE_KEY
                                      }
                                      onVerify={res => {
                                        this.setState({
                                          recaptchaResponse: res,
                                        });
                                        submitForm();
                                      }}
                                      onExpire={() => this.resetCaptcha}
                                      onError={() => this.resetCaptcha}
                                      size="invisible"
                                    />
                                  </Form>
                                )}
                              </Formik>
                            )}
                          </ApolloConsumer>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                  <div className="mt-5 text-center">
                    <Link to="/">Go back to homepage</Link>
                  </div>
                </Col>
              </Row>
            </Container>
          </Fragment>
        )}
      </GlobalConsumer>
    );
  }
}
