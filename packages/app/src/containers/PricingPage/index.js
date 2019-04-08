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

import { GlobalConsumer } from 'GlobalState';
import SafeQuery from 'components/graphql/SafeQuery';
import { ActivePlans } from 'graphql/queries';
import { displayBillingInterval } from 'utils/core';

/* eslint-disable react/prefer-stateless-function */
export default class PricingPage extends React.PureComponent {
  render() {
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
                <div className="card-deck mb-3 text-center justify-content-center">
                  <SafeQuery
                    query={ActivePlans}
                    keepExistingResultDuringRefetch
                    fetchPolicy="network-only"
                    showLoading
                    showError
                  >
                    {({ data: { plans } }) =>
                      plans.map(plan => (
                        <Card className="mb-4 shadow-sm" key={plan._id}>
                          <CardHeader>
                            <h4 className="my-0 font-weight-normal">
                              {plan.name}
                            </h4>
                          </CardHeader>
                          <CardBody>
                            <p className="lead mb-3">{plan.description}</p>
                            <h1 className="card-title pricing-card-title">
                              ${plan.price}{' '}
                              <small className="text-muted">
                                / {displayBillingInterval(plan.billingInterval)}
                              </small>
                            </h1>
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
                            <Link to="/dashboard/settings/billing">
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
                    <a href={process.env.REACT_APP_WEBSITE_URL}>
                      Return to the homepage
                    </a>
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
