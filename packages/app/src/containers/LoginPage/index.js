/**
 *
 * LoginPage
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
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { ReactstrapInput } from 'utils/formiik';
import styled from 'styled-components';
import { toast } from 'react-toastify';

import { GlobalConsumer } from 'GlobalState';
import { LOGIN_USER } from 'graphql/mutations';
import SafeMutation from 'components/graphql/SafeMutation';

const ForgotPasswordContainer = styled.div`
  margin-top: -10px;
  font-size: 12px;
  line-height: 18px;
`;

/* eslint-disable react/prefer-stateless-function */
export default class LoginPage extends React.PureComponent {
  render() {
    return (
      <Fragment>
        <Helmet>
          <title>Log In</title>
        </Helmet>
        <Container tag="main">
          <Row>
            <Col md={{ size: 6, offset: 3 }}>
              <Card>
                <CardHeader>
                  <h3 className="mb-0">Log In</h3>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col>
                      <GlobalConsumer>
                        {({ setAuthTokens, logIn }) => (
                          <SafeMutation mutation={LOGIN_USER} showError>
                            {logInUserRequest => (
                              <LoginForm
                                setAuthTokens={setAuthTokens}
                                logIn={logIn}
                                logInUserRequest={logInUserRequest}
                              />
                            )}
                          </SafeMutation>
                        )}
                      </GlobalConsumer>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
              <div className="mt-3 text-center">
                <Link to="/signup">Don&#39;t have an account?</Link>
              </div>
            </Col>
          </Row>
        </Container>
      </Fragment>
    );
  }
}

const LoginForm = props => {
  const { setAuthTokens, logIn, logInUserRequest } = props;

  const [show2FALostMsg, setShow2FALostMsg] = useState(false);

  return (
    <Formik
      initialValues={{ email: '', password: '', token: '' }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email('Invalid email')
          .required('Required'),
        password: Yup.string().required('Required'),
        token: Yup.string(),
      })}
      onSubmit={async (values, formikBag) => {
        setShow2FALostMsg(false);

        try {
          const { data } = await logInUserRequest({
            variables: {
              ...values,
            },
          });

          const { accessToken, refreshToken } = data.loginUser;

          await setAuthTokens({
            accessToken,
            refreshToken,
          });

          await logIn();
          toast.info(`Logged in successfully.`, {
            position: toast.POSITION.BOTTOM_LEFT,
            hideProgressBar: true,
            pauseOnHover: false,
            autoClose: 3000,
            draggable: false,
          });
        } catch (e) {
          if (e.name === 'apollo_link_error' && e.type === 'BAD_USER_INPUT') {
            formikBag.setErrors(e.data);

            if ('token' in e.data) {
              setShow2FALostMsg(true);
            }
          }

          formikBag.setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
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
            name="password"
            type="password"
            label="Password"
            autoComplete="current-password"
            required
          />
          <ForgotPasswordContainer className="text-right">
            <Link to="/auth/forgot-password" className="text-muted">
              forgot password?
            </Link>
          </ForgotPasswordContainer>
          <Field
            component={ReactstrapInput}
            name="token"
            type="text"
            label="2FA authentication (if enabled)"
            placeholder="Google Authenticator token"
            autoComplete="off"
          />
          <Alert hidden={!show2FALostMsg} color="warning" fade={false}>
            If you have lost your 2FA token, please open a{' '}
            <Link to="/contact-support?subject=I%20lost%20my%202FA%20device&ticketType=LOST_2FA">
              support ticket
            </Link>
            .
          </Alert>
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
            Log In
          </Button>
        </Form>
      )}
    </Formik>
  );
};
LoginForm.propTypes = {
  setAuthTokens: PropTypes.func,
  logIn: PropTypes.func,
  logInUserRequest: PropTypes.func,
};
