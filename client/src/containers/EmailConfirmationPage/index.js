/**
 *
 * EmailConfirmationPage
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Container, Row, Col, Button, Alert } from 'reactstrap';
import queryString from 'query-string';

import { GlobalConsumer } from 'GlobalState';
import SafeMutation from 'components/graphql/SafeMutation';
import { ConfirmUserEmail } from 'graphql/mutations';

/* eslint-disable react/prefer-stateless-function */
export default class EmailConfirmationPage extends React.PureComponent {
  constructor(props) {
    super(props);

    const { location } = props;
    const urlParams = queryString.parse(location.search);

    const { token } = urlParams;

    this.state = {
      confirmationToken: token || '',
    };
  }

  render() {
    const { confirmationToken } = this.state;

    return (
      <Fragment>
        <Helmet>
          <title>Email confirmation</title>
          <meta
            name="description"
            content="Description of EmailConfirmationPage"
          />
        </Helmet>
        <Container tag="main">
          <Row>
            <Col md="12" className="text-center">
              <SafeMutation
                mutation={ConfirmUserEmail}
                variables={{ confirmationToken }}
                showError
                showLoading
              >
                {confirmUserEmail => (
                  <Fragment>
                    <Button
                      color="success"
                      size="lg"
                      block
                      onClick={() => confirmUserEmail()}
                    >
                      <strong>CONFIRM MY EMAIL!</strong>
                    </Button>
                  </Fragment>
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
