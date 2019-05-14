/**
 *
 * EmailConfirmationPage
 *
 */

import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Container, Row, Col, Alert, Button } from 'reactstrap';
import queryString from 'query-string';

import { CONFIRM_USER_EMAIL } from 'graphql/mutations';
import SafeMutation from 'components/graphql/SafeMutation';

/* eslint-disable react/prefer-stateless-function */
export default class EmailConfirmationPage extends React.PureComponent {
  constructor(props) {
    super(props);

    const { location } = this.props;

    const urlParams = queryString.parse(location.search);
    const { token } = urlParams;

    this.state = {
      confirmationToken: token,
    };
  }

  render() {
    const { confirmationToken } = this.state;
    return (
      <Fragment>
        <Helmet>
          <title>Email confirmation</title>
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <Container tag="main" style={{ marginBottom: '200px' }}>
          <Row>
            <Col md="12" className="text-center">
              <SafeMutation
                mutation={CONFIRM_USER_EMAIL}
                variables={{ confirmationToken }}
                executeOnMount
                showLoading
                showError
              >
                {(_, res) => (
                  <div>
                    <Alert color="success" fade={false}>
                      <strong>
                        Thank you, your email address is now verified.
                      </strong>
                    </Alert>
                    <a href="/dashboard" hidden={res.error}>
                      <Button className="mt-2 btn-theme" size="lg">
                        Go to Dashboard
                      </Button>
                    </a>
                  </div>
                )}
              </SafeMutation>
            </Col>
          </Row>
        </Container>
      </Fragment>
    );
  }
}
EmailConfirmationPage.propTypes = {
  location: PropTypes.object,
};
