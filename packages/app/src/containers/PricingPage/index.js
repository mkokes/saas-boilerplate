/**
 *
 * PricingPage
 *
 */

import React, { Fragment } from 'react';
// import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Container, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import { GlobalConsumer } from 'GlobalState';
import SafeQuery from 'components/graphql/SafeQuery';
import { ActivePlans } from 'graphql/queries';

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
                <h2 className="color-secondary-theme mb-4" style={{}}>
                  Start with <strong>7-day free trial</strong>.
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
                        <div className="card mb-4 shadow-sm" key={plan._id}>
                          <div className="card-header">
                            <h4 className="my-0 font-weight-normal">
                              {plan.name}
                            </h4>
                          </div>
                          <div className="card-body">
                            <p className="lead mb-3">{plan.description}</p>
                            <h1 className="card-title pricing-card-title">
                              ${plan.price}{' '}
                              <small className="text-muted">
                                / {plan.billingInterval}
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
                            <Link to="/dashboard/settings/billing">
                              <Button size="lg" block className="btn-theme">
                                Subscribe
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))
                    }
                  </SafeQuery>
                </div>
                <div className="mt-5 text-center text-muted">
                  {userProfile ? (
                    <Link to="/dashboard/settings/billing">
                      <Button color="link" className="text-muted">
                        Go back to billing page
                      </Button>
                    </Link>
                  ) : (
                    <a href={process.env.REACT_APP_WEBSITE_URL}>
                      <Button color="link" className="text-muted">
                        Go back to homepage
                      </Button>
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
