/**
 *
 * SupportPage
 *
 */

import React, { Fragment } from 'react';
// import PropTypes from 'prop-types';
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
import { ReactstrapInput, ReactstrapSelect } from 'utils/formiik';
import { ApolloConsumer } from 'react-apollo';
import Reaptcha from 'reaptcha';
import _ from 'lodash';

import { GlobalConsumer } from 'GlobalState';
import { ContactSupport } from 'graphql/mutations';
import { transformApolloErr } from 'utils/apollo';

/* eslint-disable react/prefer-stateless-function */
export default class SupportPage extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      recaptchaResponse: '',
      recaptchaRendered: false,
      formMsg: null,
    };

    this.captcha = null;
  }

  resetCaptcha() {
    this.setState({ recaptchaResponse: '' });
    this.captcha.reset();
  }

  render() {
    const { recaptchaResponse, recaptchaRendered, formMsg } = this.state;

    return (
      <Fragment>
        <Helmet>
          <title>Contact Support</title>
          <meta name="description" content="Contact support page" />
        </Helmet>

        <Container tag="main">
          <Row>
            <Col md={{ size: 6, offset: 3 }}>
              <Card>
                <CardHeader>
                  <h3 className="mb-0">Contact Support</h3>
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
                      <GlobalConsumer>
                        {({ userProfile }) => (
                          <ApolloConsumer>
                            {client => (
                              <Formik
                                initialValues={{
                                  requesterName: userProfile
                                    ? userProfile.firstName
                                    : '',
                                  requesterEmail: userProfile
                                    ? userProfile.email
                                    : '',
                                  subject: '',
                                  description: '',
                                  ticketType: null,
                                }}
                                validationSchema={Yup.object().shape({
                                  requesterName: Yup.string().required(
                                    'Required',
                                  ),
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
                                  this.setState({
                                    formMsg: null,
                                  });

                                  if (!recaptchaRendered)
                                    await this.captcha.renderExplicitly();

                                  if (!recaptchaResponse) {
                                    await this.captcha.execute();
                                    setTimeout(
                                      () => formikBag.setSubmitting(false),
                                      2000,
                                    );
                                    return;
                                  }

                                  try {
                                    await client.mutate({
                                      mutation: ContactSupport,
                                      variables: {
                                        recaptchaResponse,
                                        ..._.omit(values, ['ticketType']),
                                        ticketType: values.ticketType.value,
                                      },
                                    });

                                    this.setState({
                                      formMsg: {
                                        color: 'success',
                                        text: `Thanks for contacting us.`,
                                      },
                                    });

                                    formikBag.setSubmitting(false);
                                    formikBag.resetForm();
                                  } catch (e) {
                                    const err = transformApolloErr(e);

                                    if (err.type === 'BAD_USER_INPUT') {
                                      formikBag.setErrors(err.data);
                                    } else {
                                      this.setState({
                                        formMsg: {
                                          color: 'danger',
                                          text: err.message,
                                        },
                                      });
                                    }

                                    this.resetCaptcha();
                                    formikBag.setSubmitting(false);
                                  }
                                }}
                              >
                                {({ submitForm, values, isSubmitting }) => (
                                  <Form
                                    hidden={
                                      formMsg && formMsg.color === 'success'
                                    }
                                  >
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
                                      component={ReactstrapInput}
                                      name="subject"
                                      type="text"
                                      label="Subject"
                                      required
                                    />
                                    <Field
                                      component={ReactstrapSelect}
                                      name="ticketType"
                                      label="I have a..."
                                      options={[
                                        {
                                          label: 'Question',
                                          value: 'QUESTION',
                                        },
                                        {
                                          label: 'Incident',
                                          value: 'INCIDENT',
                                        },
                                        { label: 'Problem', value: 'PROBLEM' },
                                        {
                                          label: 'Feature Request',
                                          value: 'FEATURE_REQUEST',
                                        },
                                        {
                                          label: 'Bug Report',
                                          value: 'BUG_REPORT',
                                        },
                                        {
                                          label: 'Lost 2FA',
                                          value: 'LOST_2FA',
                                        },
                                      ]}
                                      value={values.ticketType}
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
                                          className={
                                            isSubmitting ? 'mr-2' : 'd-none'
                                          }
                                        />
                                        Submit
                                      </Button>

                                      <Reaptcha
                                        // eslint-disable-next-line
                                        ref={e => (this.captcha = e)}
                                        sitekey={
                                          process.env
                                            .REACT_APP_RECAPTCHA_SITE_KEY
                                        }
                                        onVerify={res => {
                                          this.setState({
                                            recaptchaResponse: res,
                                          });
                                          submitForm();
                                        }}
                                        onExpire={() => this.resetCaptcha}
                                        onError={() => this.resetCaptcha}
                                        onRender={() =>
                                          this.setState({
                                            recaptchaRendered: true,
                                          })
                                        }
                                        size="invisible"
                                        explicit
                                      />
                                    </div>
                                  </Form>
                                )}
                              </Formik>
                            )}
                          </ApolloConsumer>
                        )}
                      </GlobalConsumer>
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

SupportPage.propTypes = {};
