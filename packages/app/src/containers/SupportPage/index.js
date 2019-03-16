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
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { ReactstrapInput, ReactstrapSelect } from 'utils/formiik';
import { ApolloConsumer } from 'react-apollo';

import { GlobalConsumer } from 'GlobalState';
import {} from 'graphql/mutations';
// import { transformApolloErr } from "utils/apollo";

/* eslint-disable react/prefer-stateless-function */
export default class SupportPage extends React.PureComponent {
  render() {
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
                    <Col>
                      <GlobalConsumer>
                        {({ userProfile }) => (
                          <ApolloConsumer>
                            {client => (
                              <Formik
                                initialValues={{
                                  requester_name: userProfile
                                    ? userProfile.firstName
                                    : '',
                                  requester_email: userProfile
                                    ? userProfile.email
                                    : '',
                                  subject: '',
                                  ticket_type: '',
                                  description: '',
                                }}
                                validationSchema={Yup.object().shape({})}
                                onSubmit={async (values, formikBag) => {
                                  console.log(client);
                                  console.log(values);
                                  console.log(formikBag);
                                }}
                              >
                                {({ isSubmitting }) => (
                                  <Form>
                                    <Field
                                      component={ReactstrapInput}
                                      name="requester_name"
                                      type="text"
                                      label="Name"
                                      autoComplete="first-name"
                                      disabled={userProfile}
                                      required
                                    />
                                    <Field
                                      component={ReactstrapInput}
                                      name="requester_email"
                                      type="email"
                                      label="Email address"
                                      autoComplete="email"
                                      disabled={userProfile}
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
                                      name="ticket_type"
                                      label="I have a..."
                                      options={[
                                        { label: 'Question', value: 0 },
                                        { label: 'Incident', value: 1 },
                                        { label: 'Problem', value: 2 },
                                        { label: 'Feature Request', value: 3 },
                                        { label: 'Bug Report', value: 4 },
                                        { label: 'Lost 2FA', value: 5 },
                                      ]}
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
