/**
 *
 * PreferencesPage
 *
 */

import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet';

import { Row, Col, Card, Button } from 'reactstrap';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { ApolloConsumer } from 'react-apollo';
import { toast } from 'react-toastify';

import { GlobalConsumer } from 'GlobalState';
import { ReactstrapCheckbox } from 'utils/formiik';
import { UpdateUserNotificationsPreferences } from 'graphql/mutations';
import { transformApolloErr } from 'utils/apollo';

/* eslint-disable react/prefer-stateless-function */
export default class PreferencesPage extends React.PureComponent {
  render() {
    return (
      <Fragment>
        <Helmet>
          <title>PreferencesPage</title>
          <meta name="description" content="Description of PreferencesPage" />
        </Helmet>
        <ApolloConsumer>
          {client => (
            <GlobalConsumer>
              {({ userProfile, setUserProfile }) => (
                <Fragment>
                  <h1 className="mb-3">Preferences</h1>
                  <Card body>
                    <legend>Notifications</legend>
                    <Row>
                      <Col xs="10" sm="8" lg="6">
                        <p
                          style={{
                            fontWeight: 600,
                            fontSize: 14,
                          }}
                          className="mb-1"
                        >
                          Email me when:
                        </p>
                        <Formik
                          initialValues={{
                            MARKETING_INFO: !!userProfile.legal.find(
                              ({ type, accepted }) =>
                                type === 'MARKETING_INFO' && accepted,
                            ),
                          }}
                          validationSchema={Yup.object().shape({})}
                          /* eslint-disable-next-line consistent-return */
                          onSubmit={async (values, formikBag) => {
                            const notifications = [];

                            Object.keys(values).forEach(key => {
                              if (values[key])
                                notifications.push({
                                  type: key,
                                  accepted: `${Date.now()}`,
                                });
                            });

                            try {
                              const {
                                data: { profile },
                              } = await client.mutate({
                                mutation: UpdateUserNotificationsPreferences,
                                variables: {
                                  notifications: {
                                    notifications,
                                  },
                                },
                              });

                              setUserProfile(profile);

                              formikBag.resetForm();
                              toast.success(
                                `Notifications preferences updated!`,
                                {
                                  position: toast.POSITION.TOP_CENTER,
                                  autoClose: 3000,
                                },
                              );
                            } catch (e) {
                              const err = transformApolloErr(e);

                              toast.error(err.message, {
                                position: toast.POSITION.TOP_CENTER,
                              });

                              formikBag.setSubmitting(false);
                            }
                          }}
                        >
                          {({ isSubmitting, values }) => (
                            <Fragment>
                              <Form>
                                <Field
                                  component={ReactstrapCheckbox}
                                  name="MARKETING_INFO"
                                  value={values.MARKETING_INFO}
                                  label="News and announcements"
                                  type="checkbox"
                                />

                                <Button
                                  type="submit"
                                  disabled={isSubmitting}
                                  className="float-left mt-2"
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

PreferencesPage.propTypes = {};
