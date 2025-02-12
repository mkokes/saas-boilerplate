/**
 *
 * ApiPage
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import { Row, Col, Card, Button, Alert } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { toast } from 'react-toastify';
import { faQuestionCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { REGENERATE_USER_API_SECRET_KEY } from 'graphql/mutations';
import { ReactstrapInput } from 'utils/formiik';
import SafeQuery from 'components/SafeQuery';
import { USER_API_SECRET_KEY_QUERY } from 'graphql/queries';
import config from 'config';
import SafeMutation from 'components/SafeMutation';

const { WEBSITE_URL } = config;

/* eslint-disable react/prefer-stateless-function */
export default class ApiPage extends React.PureComponent {
  render() {
    return (
      <Fragment>
        <Helmet>
          <title>Account API</title>
        </Helmet>
        <Fragment>
          <h1 className="mb-3">API</h1>
          <Card body>
            <legend>
              Credentials{' '}
              <a
                href={`${WEBSITE_URL}/api/information`}
                className="float-right small"
                target="_new"
              >
                API information{' '}
                <FontAwesomeIcon
                  icon={faQuestionCircle}
                  size="xs"
                  className="align-middle"
                />
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
                  Necessary when you want to make any API call on behalf of your
                  account
                </p>
              </Col>
              <Col sm="7">
                <Alert color="primary" fade={false}>
                  Regenerating your secret key will invalidate the existing
                  token, and create a new one. You should do this if you believe
                  your token has been compromised and wish to revoke API access.
                </Alert>
                <SafeQuery
                  query={USER_API_SECRET_KEY_QUERY}
                  keepExistingResultDuringRefetch
                  fetchPolicy="network-only"
                  showLoading
                  showError
                >
                  {({ data: { profile: userProfile } }) => (
                    <SafeMutation mutation={REGENERATE_USER_API_SECRET_KEY}>
                      {regenerateApiSecretKeyRequest => (
                        <RegenerateApiForm
                          userProfile={userProfile}
                          regenerateApiSecretKeyRequest={
                            regenerateApiSecretKeyRequest
                          }
                        />
                      )}
                    </SafeMutation>
                  )}
                </SafeQuery>
              </Col>
            </Row>
          </Card>
        </Fragment>
      </Fragment>
    );
  }
}

const RegenerateApiForm = props => {
  const { userProfile, regenerateApiSecretKeyRequest } = props;

  return (
    <Formik
      initialValues={{
        apiSecretKey: userProfile.apiSecretKey,
      }}
      /* eslint-disable-next-line consistent-return */
      onSubmit={async (_, formikBag) => {
        try {
          const {
            data: {
              profile: { apiSecretKey },
            },
          } = await regenerateApiSecretKeyRequest();

          formikBag.setFieldValue('apiSecretKey', apiSecretKey);
        } catch (e) {
          toast.error(e.message, {
            position: toast.POSITION.TOP_CENTER,
          });
        } finally {
          formikBag.setSubmitting(false);
        }
      }}
    >
      {({ values, isSubmitting }) => (
        <Form>
          <Field
            component={ReactstrapInput}
            name="apiSecretKey"
            label="API Secret Key"
            value={values.apiSecretKey}
            readOnly
            style={{ display: 'inline-block' }}
          />

          <Button type="submit" disabled={isSubmitting} className="float-right">
            <FontAwesomeIcon
              pulse
              icon={faSpinner}
              className={isSubmitting ? 'mr-2' : 'd-none'}
            />
            Regenerate
          </Button>
        </Form>
      )}
    </Formik>
  );
};
RegenerateApiForm.propTypes = {
  userProfile: PropTypes.object,
  regenerateApiSecretKeyRequest: PropTypes.func,
};
