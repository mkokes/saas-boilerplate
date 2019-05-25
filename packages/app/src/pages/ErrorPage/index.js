/**
 *
 * ErrorPage
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Container, Button } from 'reactstrap';
import * as Sentry from '@sentry/browser';
import { GlobalConsumer } from 'GlobalState';

import config from 'config';
const { PRODUCT_NAME, WEBSITE_URL } = config;

/* eslint-disable react/prefer-stateless-function */
export default class ErrorPage extends React.PureComponent {
  constructor(props) {
    super(props);

    const { error } = props;

    this.state = { eventId: null };

    const eventId = Sentry.captureException(error);
    this.setState({ eventId });
  }

  render() {
    const { stacktrace, error } = this.props;
    const { eventId } = this.state;

    return (
      <Fragment>
        <Helmet>
          <title>Oops! An error occured!</title>
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <Container className="flex flex-column justify-content-center min-vh-100">
          <h1 className="text-danger">Oops! An error occured!</h1>
          <p className="mb-4">Here’s what we know…</p>
          <p className="mb-0">
            <strong>Error:</strong> {error.toString()}
          </p>
          <p>
            <strong>Stacktrace:</strong> <pre>{stacktrace}</pre>
          </p>
          <GlobalConsumer>
            {({ userProfile }) => (
              <Button
                onClick={() =>
                  Sentry.showReportDialog({
                    eventId,
                    user: {
                      name: userProfile
                        ? `${userProfile.firstName} ${userProfile.lastName}`
                        : null,
                      email: userProfile ? userProfile.email : null,
                    },
                  })
                }
                size="lg"
                block
                className="btn-theme"
              >
                Report error to {PRODUCT_NAME} team
              </Button>
            )}
          </GlobalConsumer>
          <div className="text-center mt-5">
            <a href={WEBSITE_URL} className="text-muted">
              Go to homepage
            </a>
          </div>
        </Container>
      </Fragment>
    );
  }
}

ErrorPage.propTypes = {
  stacktrace: PropTypes.string,
  error: PropTypes.object,
};
