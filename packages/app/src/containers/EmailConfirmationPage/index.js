/**
 *
 * EmailConfirmationPage
 *
 */

import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useAsyncEffect } from 'use-async-effect';
import { Helmet } from 'react-helmet';
import { Container, Row, Col, Alert, Button } from 'reactstrap';
import queryString from 'query-string';
import { withApollo } from 'react-apollo';

import { CONFIRM_USER_EMAIL } from 'graphql/mutations';
import { transformApolloErr } from 'utils/apollo';
import Loader from 'components/Loader';

function EmailConfirmationPage(props) {
  const [alertMessage, setAlertMessage] = useState({});
  const { location, client } = props;

  const urlParams = queryString.parse(location.search);

  const { token } = urlParams;

  useAsyncEffect(
    async () => {
      try {
        await client.mutate({
          mutation: CONFIRM_USER_EMAIL,
          variables: { confirmationToken: token || '' },
        });

        setAlertMessage({
          color: 'success',
          text: 'Thank you, your email address is now verified.',
        });
      } catch (e) {
        const err = transformApolloErr(e);

        setAlertMessage({ color: 'danger', text: err.message });
      }
    },
    undefined,
    [],
  );

  return (
    <Fragment>
      <Helmet>
        <title>Email confirmation</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <Container tag="main" style={{ marginBottom: '200px' }}>
        <Row>
          <Col md="12" className="text-center">
            {alertMessage ? (
              <Fragment>
                <Alert color={alertMessage.color}>
                  <strong>{alertMessage.text}</strong>
                </Alert>
                {alertMessage.color === 'success' && (
                  <a href="/dashboard">
                    <Button className="mt-2 btn-theme" size="lg">
                      Go to Dashboard
                    </Button>
                  </a>
                )}
              </Fragment>
            ) : (
              <Loader />
            )}
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
}

EmailConfirmationPage.propTypes = {
  location: PropTypes.object,
  client: PropTypes.object,
};

export default withApollo(EmailConfirmationPage);
