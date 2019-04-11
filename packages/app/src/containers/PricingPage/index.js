/**
 *
 * PricingPage
 *
 */

import React, { Fragment } from 'react';
// import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import {
  Container,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import Switch from 'react-switch';

import { GlobalConsumer } from 'GlobalState';
import SafeQuery from 'components/graphql/SafeQuery';
import { ACTIVE_PLANS_QUERY } from 'graphql/queries';
import { displayBillingInterval } from 'utils/core';
import config from 'config';

const { WEBSITE_URL } = config;

/* eslint-disable react/prefer-stateless-function */
export default class PricingPage extends React.PureComponent {
  constructor() {
    super();
    this.state = { billingIntervalToggler: false };
    this.handleChangeBillingIntervalToggler = this.handleChangeBillingIntervalToggler.bind(
      this,
    );
  }

  handleChangeBillingIntervalToggler(billingIntervalToggler) {
    this.setState({ billingIntervalToggler });
  }

  render() {
    const { billingIntervalToggler } = this.state;

    return (
      <Fragment>
        <Helmet>
          <title>Pricing</title>
          <meta name="description" content="Our plans" />
        </Helmet>
        <GlobalConsumer>
          {({ userProfile }) => (
            <Fragment>
              <Container tag="main" className="text-center">
                <h2
                  className="color-secondary-theme mb-4"
                  style={{ marginTop: '-20px' }}
                >
                  {userProfile ? (
                    <Fragment>Pick a plan that&apos;s right for you</Fragment>
                  ) : (
                    <Fragment>
                      Start with <strong>7-day free trial</strong>.
                    </Fragment>
                  )}
                </h2>
                <div className="mb-4 text-right" style={{ fontSize: '1.4em' }}>
                  <span
                    className={
                      !billingIntervalToggler
                        ? 'font-weight-bold'
                        : 'text-muted'
                    }
                  >
                    Monthly
                  </span>
                  <Switch
                    onChange={this.handleChangeBillingIntervalToggler}
                    checked={billingIntervalToggler}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    onColor="#888888"
                    className="align-middle mr-2 ml-2"
                  />
                  <span
                    className={
                      billingIntervalToggler ? 'font-weight-bold' : 'text-muted'
                    }
                  >
                    Yearly (10% OFF)
                  </span>
                </div>
                <div className="card-deck mb-3 text-center justify-content-center">
                  <SafeQuery
                    query={ACTIVE_PLANS_QUERY}
                    keepExistingResultDuringRefetch
                    fetchPolicy="network-only"
                    showLoading
                    showError
                  >
                    {({ data: { plans } }) =>
                      plans.map(plan => (
                        <Card
                          className="mb-4 shadow-sm"
                          key={plan._id}
                          hidden={
                            plan.billingInterval ===
                            (billingIntervalToggler ? 'monthly' : 'yearly')
                          }
                        >
                          <CardHeader>
                            <h4 className="my-0 font-weight-normal">
                              {plan.name}
                            </h4>
                          </CardHeader>
                          <CardBody>
                            <h1 className="card-title pricing-card-title">
                              ${plan.price}{' '}
                              <small className="text-muted">
                                / {displayBillingInterval(plan.billingInterval)}
                              </small>
                            </h1>
                            <p className="lead mb-3">{plan.description}</p>
                            <ul
                              className="list-unstyled mt-3 mb-4"
                              style={{ minHeight: '50px' }}
                            >
                              {plan.features.map(feature => (
                                <li
                                  key={`features-${plan._id}-${feature.trim()}`}
                                >
                                  <span className="color-primary-theme">
                                    <FontAwesomeIcon icon={faCheck} />
                                  </span>{' '}
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </CardBody>
                          <CardFooter>
                            <Link
                              to={`/dashboard/settings/billing?interval=${
                                !billingIntervalToggler ? 'monthly' : 'yearly'
                              }`}
                            >
                              <Button size="lg" block className="btn-theme">
                                {userProfile ? 'SUBSCRIBE' : 'START TRIAL'}
                              </Button>
                            </Link>
                          </CardFooter>
                        </Card>
                      ))
                    }
                  </SafeQuery>
                </div>
                <div className="mt-5 mb-5 text-center text-muted">
                  {userProfile ? (
                    <Link to="/dashboard/settings/billing">
                      Return to the billing page
                    </Link>
                  ) : (
                    <a href={WEBSITE_URL}>Return to the homepage</a>
                  )}
                </div>
              </Container>
            </Fragment>
          )}
        </GlobalConsumer>
      </Fragment>
    );
  }
}

PricingPage.propTypes = {};
