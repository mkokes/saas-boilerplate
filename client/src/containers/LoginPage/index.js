/**
 *
 * LoginPage
 *
 */

import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import styled from 'styled-components';
import { Grid, Segment, Header } from 'semantic-ui-react';
import { Button, Form, Input } from 'formik-semantic-ui';

const ForgotPasswordLink = styled.div`
  text-align: right;
  margin-top: -10px;
  margin-bottom: 14px;
`;

/* eslint-disable react/prefer-stateless-function */
export default class LoginPage extends React.PureComponent {
  handleSubmit = (values, formikApi) => {
    console.log(values);
    setTimeout(() => {
      Object.keys(values).forEach(key => {
        formikApi.setFieldError(key, 'SomeError');
      });
      formikApi.setSubmitting(false);
    }, 1000);
  };

  render() {
    return (
      <Fragment>
        <Helmet>
          <title>LoginPage</title>
          <meta name="description" content="Description of LoginPage" />
        </Helmet>
        <main>
          <Grid verticalAlign="middle" centered columns={2} stackable>
            <Grid.Column tablet={10} computer={5}>
              <Header as="h2" attached="top" inverted>
                Authentication
              </Header>

              <Segment attached>
                <Form
                  serverValidation
                  initialValues={{
                    userIdentifier: '',
                    password: '',
                  }}
                  validationSchema={Yup.object().shape({
                    userIdentifier: Yup.string().required('Required'),
                    password: Yup.string().required('Required'),
                  })}
                  onSubmit={this.handleSubmit}
                  render={() => (
                    <Form.Children>
                      <Input
                        label="Email address or username"
                        name="userIdentifier"
                        type="text"
                        autoComplete="e-mail"
                      />
                      <Input
                        label="Password"
                        name="password"
                        type="password"
                        autoComplete="password"
                      />
                      <ForgotPasswordLink>
                        <Link
                          to="/auth/forgot_password"
                          style={{ color: 'gray' }}
                        >
                          forgot password?
                        </Link>
                      </ForgotPasswordLink>
                      <Button.Submit size="huge" positive fluid>
                        Log in
                      </Button.Submit>
                    </Form.Children>
                  )}
                />
              </Segment>
            </Grid.Column>
          </Grid>
        </main>
      </Fragment>
    );
  }
}

LoginPage.propTypes = {};
