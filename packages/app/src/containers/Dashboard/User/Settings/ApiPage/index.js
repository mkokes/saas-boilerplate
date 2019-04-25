/**
 *
 * ApiPage
 *
 */

import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet';

import { Row, Col, Card, Button, Alert } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { ApolloConsumer } from 'react-apollo';
import { toast } from 'react-toastify';
import { faQuestionCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { transformApolloErr } from 'utils/apollo';
import { REGENERATE_USER_API_SECRET_KEY } from 'graphql/mutations';
import { ReactstrapInput } from 'utils/formiik';
import SafeQuery from 'components/graphql/SafeQuery';
import { USER_API_SECRET_KEY_QUERY } from 'graphql/queries';
import config from 'config';

const { WEBSITE_URL } = config;

/* eslint-disable react/prefer-stateless-function */
export default class ApiPage extends React.PureComponent {
  render() {
    return (
      <Fragment>
        <Helmet>
          <title>ApiPage</title>
        </Helmet>
        <ApolloConsumer>
          {client => (
            <Fragment>
              <h1 className="mb-3">API</h1>
              <Card body>
                <legend>
                  Credentials{' '}
                  <a
                    href={`${WEBSITE_URL}/api/information`}
                    className="float-right"
                    target="_new"
                  >
                    <small>
                      API information{' '}
                      <FontAwesomeIcon
                        icon={faQuestionCircle}
                        size="xs"
                        className="align-middle"
                      />
                    </small>
                  </a>
                </legend>
                <Row>
                  <Col xs="12" sm="4">
                    <p
                      style={{
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                      className="mb-0"
                    >
                      API Secret Key
                    </p>
                    <p style={{ fontWeight: 200, fontSize: 14 }}>
                      Necessary when you want to make any API call on behalf of
                      your account
                    </p>
                  </Col>
                  <Col>
                    <SafeQuery
                      query={USER_API_SECRET_KEY_QUERY}
                      keepExistingResultDuringRefetch
                      fetchPolicy="network-only"
                      showLoading
                      showError
                    >
                      {({ data: { profile } }) => (
                        <Formik
                          initialValues={{
                            apiSecretKey: profile.apiSecretKey,
                          }}
                          /* eslint-disable-next-line consistent-return */
                          onSubmit={async (_, formikBag) => {
                            try {
                              const {
                                data: { profile: updatedProfile },
                              } = await client.mutate({
                                mutation: REGENERATE_USER_API_SECRET_KEY,
                              });

                              formikBag.setFieldValue(
                                'apiSecretKey',
                                updatedProfile.apiSecretKey,
                              );
                              formikBag.setSubmitting(false);
                            } catch (e) {
                              const err = transformApolloErr(e);

                              if (err.type === 'BAD_USER_INPUT') {
                                formikBag.setErrors(err.data);
                              } else {
                                toast.error(err.message, {
                                  position: toast.POSITION.TOP_CENTER,
                                });
                              }

                              formikBag.setSubmitting(false);
                            }
                          }}
                        >
                          {({ values, isSubmitting }) => (
                            <Fragment>
                              <Form>
                                <Alert color="primary" fade={false}>
                                  Regenerating your secret key will invalidate
                                  the existing token, and create a new one. You
                                  should do this if you believe your token has
                                  been compromised and wish to revoke API
                                  access.
                                </Alert>
                                <Field
                                  component={ReactstrapInput}
                                  name="apiSecretKey"
                                  label="API Secret Key"
                                  value={values.apiSecretKey}
                                  readOnly
                                  style={{ display: 'inline-block' }}
                                />

                                <Button type="submit" disabled={isSubmitting}>
                                  <FontAwesomeIcon
                                    pulse
                                    icon={faSpinner}
                                    className={isSubmitting ? 'mr-2' : 'd-none'}
                                  />
                                  Regenerate
                                </Button>
                              </Form>
                            </Fragment>
                          )}
                        </Formik>
                      )}
                    </SafeQuery>
                  </Col>
                </Row>
              </Card>
            </Fragment>
          )}
        </ApolloConsumer>
      </Fragment>
    );
  }
}

ApiPage.propTypes = {};
