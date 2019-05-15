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
import { toast } from 'react-toastify';

import { GlobalConsumer } from 'GlobalState';
import SafeQuery from 'components/graphql/SafeQuery';
import { ReactstrapSelect, ReactstrapCheckbox } from 'utils/formiik';
import {
  UPDATE_USER_NOTIFICATIONS_PREFERENCES,
  UPDATE_USER_PREFERENCES,
} from 'graphql/mutations';
import { USER_NOTIFICATIONS_PREFERENCES } from 'graphql/queries';
import { getTimezones } from 'utils/moment';
import SafeMutation from 'components/graphql/SafeMutation';

/* eslint-disable react/prefer-stateless-function */
export default class PreferencesPage extends React.PureComponent {
  constructor() {
    super();

    this.timezones = getTimezones();
  }

  render() {
    return (
      <Fragment>
        <Helmet>
          <title>Account preferences</title>
        </Helmet>
        <GlobalConsumer>
          {({ userProfile, setUserProfile }) => (
            <Fragment>
              <h1 className="mb-3">Preferences</h1>
              <Card body>
                <legend>Account Preferences</legend>
                <Row>
                  <Col xs="10" sm="8" lg="6">
                    <SafeMutation mutation={UPDATE_USER_PREFERENCES}>
                      {updateUserPreferences => (
                        <Formik
                          initialValues={{
                            timezone: this.timezones.find(
                              ({ value }) => value === userProfile.timezone,
                            ),
                          }}
                          validationSchema={Yup.object().shape({
                            timezone: Yup.object().required('Required'),
                          })}
                          /* eslint-disable-next-line consistent-return */
                          onSubmit={async (values, formikBag) => {
                            const timezone = values.timezone.value;

                            try {
                              const {
                                data: { profile },
                              } = await updateUserPreferences({
                                variables: {
                                  preferences: {
                                    timezone,
                                  },
                                },
                              });

                              setUserProfile(profile);

                              toast.success(
                                `Preferences updated successfully.`,
                                {
                                  position: toast.POSITION.TOP_CENTER,
                                  autoClose: 3000,
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
                          {({ values, isSubmitting }) => (
                            <Fragment>
                              <Form>
                                <Field
                                  component={ReactstrapSelect}
                                  name="timezone"
                                  label="Time zone"
                                  options={this.timezones}
                                  value={values.timezone}
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
                      )}
                    </SafeMutation>
                  </Col>
                </Row>
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
                    <SafeQuery
                      query={USER_NOTIFICATIONS_PREFERENCES}
                      keepExistingResultDuringRefetch
                      fetchPolicy="network-only"
                      showLoading
                      showError
                    >
                      {({ data: { notificationsPreferences } }) => (
                        <SafeMutation
                          mutation={UPDATE_USER_NOTIFICATIONS_PREFERENCES}
                        >
                          {updateUserNotificationsPreferences => (
                            <Formik
                              initialValues={{
                                MARKETING_INFO: !!notificationsPreferences.find(
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
                                  } = await updateUserNotificationsPreferences({
                                    variables: {
                                      notifications: {
                                        notifications,
                                      },
                                    },
                                  });

                                  setUserProfile(profile);

                                  toast.success(
                                    `Notifications preferences updated successfully.`,
                                    {
                                      position: toast.POSITION.TOP_CENTER,
                                      autoClose: 3000,
                                    },
                                  );
                                } catch (e) {
                                  toast.error(e.message, {
                                    position: toast.POSITION.TOP_CENTER,
                                  });
                                }

                                formikBag.setSubmitting(false);
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
                                        className={
                                          isSubmitting ? 'mr-2' : 'd-none'
                                        }
                                      />
                                      Save
                                    </Button>
                                  </Form>
                                </Fragment>
                              )}
                            </Formik>
                          )}
                        </SafeMutation>
                      )}
                    </SafeQuery>
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

PreferencesPage.propTypes = {};
