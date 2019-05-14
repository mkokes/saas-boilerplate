/**
 *
 * ResetPasswordPage
 *
 */

import React, { Fragment, useState } from 'react';
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
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { ReactstrapInput } from 'utils/formiik';
import SafeMutation from 'components/graphql/SafeMutation';

import { RESET_USER_PASSWORD } from 'graphql/mutations';
import { equalTo } from 'utils/yup';

Yup.addMethod(Yup.string, 'equalTo', equalTo);

/* eslint-disable react/prefer-stateless-function */
export default class ResetPasswordPage extends React.PureComponent {
  constructor(props) {
    super(props);

    const { location } = props;
    const urlParams = queryString.parse(location.search);

    const { token } = urlParams;

    this.state = {
      gotResetTokenFromUrl: token || '',
    };
  }

  render() {
    const { gotResetTokenFromUrl } = this.state;

    return (
      <Fragment>
        <Helmet>
          <title>Set a New Password</title>
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <Container tag="main">
          <Row>
            <Col md={{ size: 6, offset: 3 }}>
              <Card>
                <CardHeader>
                  <h3 className="mb-0">Password Reset</h3>
                </CardHeader>
                <CardBody>
                  <SafeMutation mutation={RESET_USER_PASSWORD} showError>
                    {resetPasswordRequest => (
                      <ResetPasswordForm
                        resetPasswordRequest={resetPasswordRequest}
                        data={{
                          initialValues: {
                            resetToken: gotResetTokenFromUrl,
                          },
                        }}
                      />
                    )}
                  </SafeMutation>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </Fragment>
    );
  }
}
ResetPasswordPage.propTypes = {
  location: PropTypes.object,
};

const ResetPasswordForm = props => {
  const { resetPasswordRequest, data } = props;

  const [hideForm, setHideForm] = useState(false);
  const [hideRetryProcessPrompt, setHideRetryProcessPrompt] = useState(true);
  const [hideLoginPrompt, setHideLoginPrompt] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  return (
    <Formik
      initialValues={{
        ...data.initialValues,
        newPassword: '',
        confirmNewPassword: '',
      }}
      validationSchema={Yup.object().shape({
        newPassword: Yup.string().required('Required'),
        confirmNewPassword: Yup.string()
          .equalTo(Yup.ref('newPassword'), 'Password does not match')
          .required('Required'),
      })}
      onSubmit={async (values, formikBag) => {
        try {
          await resetPasswordRequest({
            mutation: RESET_USER_PASSWORD,
            variables: {
              resetToken: values.resetToken,
              newPassword: values.newPassword,
            },
          });

          setHideForm(true);
          setHideLoginPrompt(false);
          setShowSuccessMessage(true);
        } catch (e) {
          if (e.name === 'apollo_link_error') {
            // eslint-disable-next-line default-case
            switch (e.type) {
              case 'BAD_USER_INPUT':
                formikBag.setErrors(e.data);
                break;
              case 'INVALID_PASSWORD_RESET_TOKEN':
                setHideForm(true);
                setHideRetryProcessPrompt(false);
                break;
            }
          }
        }

        formikBag.setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Fragment>
          <Row>
            <Col>
              <Alert
                color="success"
                role="alert"
                fade={false}
                className="text-center"
                hidden={!showSuccessMessage}
              >
                <strong>Password has been reset. Now you can log in.</strong>
              </Alert>
              <Form hidden={hideForm}>
                <div hidden={data.initialValues.resetToken}>
                  <Field
                    component={ReactstrapInput}
                    name="resetToken"
                    type="text"
                    label="Reset token"
                    placeholder="(check received reset instructions email)"
                    autoComplete="off"
                  />
                </div>
                <Field
                  component={ReactstrapInput}
                  name="newPassword"
                  type="password"
                  label="New password"
                  autoComplete="new-password"
                />
                <Field
                  component={ReactstrapInput}
                  name="confirmNewPassword"
                  type="password"
                  label="Confirm password"
                  autoComplete="new-password"
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
                    Reset
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>
          <Row hidden={hideRetryProcessPrompt}>
            <Col className="text-center">
              <Link to="/auth/forgot-password">
                <Button className="btn-theme">Request new password link</Button>
              </Link>
            </Col>
          </Row>
          <Row hidden={hideLoginPrompt}>
            <Col className="text-center">
              <Link to="/auth/login">
                <Button className="btn-theme">Go to login page</Button>
              </Link>
            </Col>
          </Row>
        </Fragment>
      )}
    </Formik>
  );
};
ResetPasswordForm.propTypes = {
  resetPasswordRequest: PropTypes.func,
  data: PropTypes.object,
};
