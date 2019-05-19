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

import config from 'config';
const { PRODUCT_NAME, WEBSITE_URL } = config;

/* eslint-disable react/prefer-stateless-function */
export default class ErrorPage extends React.PureComponent {
  constructor(props) {
    super(props);

    const { stacktrace, error } = props;

    this.state = { eventId: null };

    Sentry.withScope(scope => {
      scope.setExtras(stacktrace);
      const eventId = Sentry.captureException(error);
      this.setState({ eventId });
    });
  }

  render() {
    const { stacktrace, error } = this.props;
    const { eventId } = this.state;

    return (
      <Fragment>
        <Helmet>
          <title>Oops! An error occured!</title>
          <meta name="description" content="Description of ErrorPage" />
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
          <Button
            onClick={() => Sentry.showReportDialog({ eventId })}
            size="lg"
            block
            className="btn-theme"
          >
            Report feedback to {PRODUCT_NAME} team
          </Button>
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
  stacktrace: PropTypes.object,
  error: PropTypes.object,
};
