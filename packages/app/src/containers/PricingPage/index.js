/**
 *
 * PricingPage
 *
 */

import React, { Fragment } from 'react';
// import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Container } from 'reactstrap';

/* eslint-disable react/prefer-stateless-function */
export default class PricingPage extends React.PureComponent {
  render() {
    return (
      <Fragment>
        <Helmet>
          <title>PricingPage</title>
          <meta name="description" content="Description of PricingPage" />
        </Helmet>
        <Container className="app-container flex flex-column justify-content-center">
          <div className="card-deck mb-3 text-center">
            <div className="card mb-4 shadow-sm">
              <div className="card-header">
                <h4 className="my-0 font-weight-normal">Monthly Plan</h4>
              </div>
              <div className="card-body">
                <h1 className="card-title pricing-card-title">
                  $10 <small className="text-muted">/ mo</small>
                </h1>
                <ul className="list-unstyled mt-3 mb-4">
                  <li>20 users included</li>
                  <li>10 GB of storage</li>
                  <li>Priority email support</li>
                  <li>Help center access</li>
                </ul>
                <button
                  type="button"
                  className="btn btn-lg btn-block btn-primary"
                >
                  Start 7-Day Free Trial
                </button>
              </div>
            </div>
            <div className="card mb-4 shadow-sm">
              <div className="card-header">
                <h4 className="my-0 font-weight-normal">Annual Plan</h4>
              </div>
              <div className="card-body">
                <h1 className="card-title pricing-card-title">
                  $100 <small className="text-muted">/ year</small>
                </h1>
                <ul className="list-unstyled mt-3 mb-4">
                  <li>30 users included</li>
                  <li>15 GB of storage</li>
                  <li>Phone and email support</li>
                  <li>Help center access</li>
                </ul>
                <button
                  type="button"
                  className="btn btn-lg btn-block btn-primary"
                >
                  Start 7-Day Free Trial
                </button>
              </div>
            </div>
          </div>
        </Container>
      </Fragment>
    );
  }
}

PricingPage.propTypes = {};
