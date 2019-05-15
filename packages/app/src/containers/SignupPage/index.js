/**
 *
 * SignupPage
 *
 */

import React, { Fragment, useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import {
  Container,
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Button,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Formik, Form, Field } from 'formik';
import { ReactstrapInput } from 'utils/formiik';
import * as Yup from 'yup';
import Reaptcha from 'reaptcha';
import MomentTimezone from 'moment-timezone';
import queryString from 'query-string';
import axios from 'axios';

import { SIGNUP_USER } from 'graphql/mutations';
import { GlobalConsumer } from 'GlobalState';
import config from 'config';
import SafeMutation from 'components/SafeMutation';

const { RECAPTCHA_SITE_KEY, WEBSITE_URL } = config;

/* eslint-disable react/prefer-stateless-function */
export default class SignupPage extends React.PureComponent {
  constructor(props) {
    super(props);

    const { location } = props;
    const urlParams = queryString.parse(location.search);
    const { src, email } = urlParams;

    this.state = {
      signupSource: src,
      initialEmail: email || '',
      signupIP: '',
      signupCity: '',
      signupCountry: '',
    };
  }

  async componentDidMount() {
    try {
      const response = await axios.get('https://ipinfo.io/json');
      const { data } = response;

      this.setState({
        signupIP: data.ip,
        signupCity: data.city,
        signupCountry: data.country,
      });
    } catch (e) {
      /* eslint-disable-next-line */
      console.warn('Unable to get user IP address from ipinfo.io', e);
    }
  }

  render() {
    const {
      initialEmail: email,
      signupSource,
      signupIP,
      signupCity,
      signupCountry,
    } = this.state;

    return (
      <Fragment>
        <Helmet>
          <title>Sign up</title>
        </Helmet>

        <Container tag="main">
          <Row>
            <Col md={{ size: 6, offset: 3 }}>
              <Card>
                <CardHeader>
                  <h3 className="mb-0">Sign up</h3>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col>
                      <GlobalConsumer>
                        {({ setAuthTokens, signUp }) => (
                          <SafeMutation mutation={SIGNUP_USER} showError>
                            {signUpRequest => (
                              <SignupForm
                                setAuthTokens={setAuthTokens}
                                signUp={signUp}
                                signUpRequest={signUpRequest}
                                data={{
                                  initialValues: {
                                    email,
                                  },
                                  mutationVariables: {
                                    signupSource,
                                    signupIP,
                                    signupCity,
                                    signupCountry,
                                  },
                                }}
                                isCaptchaValid={this.isCaptchaValid}
                                initCaptcha={this.initCaptcha}
                                resetCaptcha={this.resetCaptcha}
                              />
                            )}
                          </SafeMutation>
                        )}
                      </GlobalConsumer>
                      <p className="mt-1 pr-lg-5 pl-lg-5 text-center text-muted small">
                        By signing up, you agree to our{' '}
                        <a
                          href={`${WEBSITE_URL}/legal/terms-service`}
                          target="popup"
                        >
                          Terms of Service
                        </a>{' '}
                        and that you have read our{' '}
                        <a
                          href={`${WEBSITE_URL}/legal/privacy-policy`}
                          target="popup"
                        >
                          Privacy Policy
                        </a>
                        .
                      </p>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
              <div className="mt-3 text-center">
                <Link to="/auth/login">Already have an account? Log in</Link>
              </div>
            </Col>
          </Row>
        </Container>
      </Fragment>
    );
  }
}

SignupPage.propTypes = {
  location: PropTypes.object,
};

const SignupForm = props => {
  const { setAuthTokens, signUp, signUpRequest, data } = props;

  const [captchaRendered, setCaptchaRendered] = useState(false);
  const [captchaResponse, setCaptchaResponse] = useState('');
  const [alreadyTakenEmails, setAlreadyTakenEmails] = useState([]);

  const resetCaptcha = async () => {
    setCaptchaResponse('');
    try {
      await captcha.current.reset();
      // eslint-disable-next-line no-empty
    } catch (_) {}
  };

  const captcha = useRef(null);

  return (
    <Formik
      initialValues={{
        ...data.initialValues,
        firstName: '',
        lastName: '',
        password: '',
        recaptchaResponse: captchaResponse,
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email('Invalid email')
          .notOneOf(alreadyTakenEmails, 'Already in use, use another email')
          .required('Required'),
        firstName: Yup.string()
          .min(2, 'Too short!')
          .required('Required'),
        lastName: Yup.string()
          .min(2, 'Too short!')
          .required('Required'),
        password: Yup.string().required('Required'),
      })}
      onSubmit={async (values, formikBag) => {
        if (!captchaRendered) await captcha.current.renderExplicitly();
        if (!captchaResponse) {
          await captcha.current.execute();
          return setTimeout(() => formikBag.setSubmitting(false), 4000);
        }

        try {
          const {
            data: { signUpUser },
          } = await signUpRequest({
            mutation: SIGNUP_USER,
            variables: {
              ...data.mutationVariables,
              ...values,
              timezone: MomentTimezone.tz.guess(),
              recaptchaResponse: captchaResponse,
            },
          });

          const { accessToken, refreshToken } = signUpUser;

          await setAuthTokens({
            accessToken,
            refreshToken,
          });

          return await signUp();
        } catch (e) {
          if (e.name === 'apollo_link_error' && e.type === 'BAD_USER_INPUT') {
            formikBag.setErrors(e.data);

            if ('email' in e.data) {
              setAlreadyTakenEmails([...alreadyTakenEmails, values.email]);
            }
          }

          await resetCaptcha();
          return formikBag.setSubmitting(false);
        }
      }}
    >
      {({ submitForm, isSubmitting }) => (
        <Form>
          <Row>
            <Col>
              <Field
                component={ReactstrapInput}
                name="firstName"
                type="text"
                placeholder="First name"
                label="First name"
                autoComplete="first-name"
                autoFocus
                required
              />
            </Col>
            <Col>
              <Field
                component={ReactstrapInput}
                name="lastName"
                type="text"
                placeholder="Last name"
                label="Last name"
                autoComplete="last-name"
                required
              />
            </Col>
          </Row>
          <Field
            component={ReactstrapInput}
            name="email"
            type="email"
            placeholder="Your email address"
            label="Email address"
            autoComplete="username" // using "username" forces browsers to use email when login
            required
          />
          <Field
            component={ReactstrapInput}
            name="password"
            type="password"
            placeholder="Choose a password"
            label="Password"
            autoComplete="new-password"
            required
          />

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
        </Form>
      )}
    </Formik>
  );
};
SignupForm.propTypes = {
  setAuthTokens: PropTypes.func,
  signUp: PropTypes.func,
  signUpRequest: PropTypes.func,
  data: PropTypes.object,
};
