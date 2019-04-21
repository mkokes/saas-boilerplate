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
import { faCheck, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import Switch from 'react-switch';
import styled from 'styled-components';

import { GlobalConsumer } from 'GlobalState';
import SafeQuery from 'components/graphql/SafeQuery';
import { PLANS_QUERY } from 'graphql/queries';
import { displayBillingInterval } from 'utils/core';
import config from 'config';

const { WEBSITE_URL } = config;

const Faq = styled.section``;
const FaqQuestion = styled.section`
  text-align: left;
  margin: 0 auto;
  max-width: 800px;
`;
const FaqQuestionTitle = styled.h5`
  font-size: '1em';
  font-weight: '400';
`;

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

                <SafeQuery
                  query={PLANS_QUERY}
                  keepExistingResultDuringRefetch
                  fetchPolicy="cache-and-network"
                  showLoading
                  showError
                >
                  {({ data: { plans } }) => (
                    <Fragment>
                      <div
                        className="mb-4 text-sm-right"
                        style={{ fontSize: '1.4em' }}
                      >
                        <Button
                          color="link"
                          className={
                            !billingIntervalToggler
                              ? 'font-weight-bold text-dark'
                              : 'text-muted'
                          }
                          style={{
                            cursor: billingIntervalToggler && 'pointer',
                            textDecoration: 'none',
                            padding: '0',
                            fontSize: '1.15em',
                          }}
                          onClick={() =>
                            this.setState({ billingIntervalToggler: false })
                          }
                        >
                          Monthly
                        </Button>
                        <Switch
                          onChange={this.handleChangeBillingIntervalToggler}
                          checked={billingIntervalToggler}
                          uncheckedIcon={false}
                          checkedIcon={false}
                          onColor="#888888"
                          className="align-middle mt-1 mr-2 ml-2"
                        />
                        <Button
                          color="link"
                          className={
                            billingIntervalToggler
                              ? 'font-weight-bold text-dark'
                              : 'text-muted'
                          }
                          style={{
                            cursor: !billingIntervalToggler && 'pointer',
                            textDecoration: 'none',
                            padding: '0',
                            fontSize: '1.15em',
                          }}
                          onClick={() =>
                            this.setState({ billingIntervalToggler: true })
                          }
                        >
                          Yearly (10% OFF)
                        </Button>
                      </div>
                      <div className="card-deck mb-3 text-center justify-content-center">
                        {plans.map(plan => (
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
                                  /{' '}
                                  {displayBillingInterval(plan.billingInterval)}
                                </small>
                              </h1>
                              <p className="lead mb-3">{plan.description}</p>
                              <ul
                                className="list-unstyled mt-3 mb-4"
                                style={{ minHeight: '50px' }}
                              >
                                {plan.features.map(feature => (
                                  <li
                                    key={`features-${
                                      plan._id
                                    }-${feature.trim()}`}
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
                                  {userProfile
                                    ? 'SUBSCRIBE'
                                    : 'START FREE TRIAL'}
                                </Button>
                              </Link>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </Fragment>
                  )}
                </SafeQuery>

                <Faq>
                  <h3 className="mb-4">Frequently Asked Questions:</h3>
                  <FaqQuestion>
                    <FaqQuestionTitle>
                      What types of payment do you accept?
                    </FaqQuestionTitle>
                    <p>
                      We accept PayPal, Apple Pay, all major credit cards and
                      cryptocurrency for every plan.
                    </p>
                  </FaqQuestion>
                  <FaqQuestion>
                    <FaqQuestionTitle>
                      What happens after my free trial?
                    </FaqQuestionTitle>
                    <p className="mb-0">
                      After the trial period your subscription will
                      automatically be cancelled.
                    </p>
                    <p>
                      If you chosen to continue you will need to subscribe to
                      any plan from your billing page.
                    </p>
                  </FaqQuestion>
                  <FaqQuestion>
                    <FaqQuestionTitle>More questions?</FaqQuestionTitle>
                    <p>
                      Get in touch at{' '}
                      <a href="mailto:sales@domain.io" className="link">
                        sales@domain.io
                      </a>
                    </p>
                  </FaqQuestion>
                </Faq>
                <div className="mt-5 mb-5 text-center text-muted">
                  {userProfile ? (
                    <Link to="/dashboard/settings/billing">
                      <FontAwesomeIcon icon={faChevronLeft} size="lg" /> Return
                      to the billing page
                    </Link>
                  ) : (
                    <a href={WEBSITE_URL}>
                      <FontAwesomeIcon icon={faChevronLeft} size="lg" /> Return
                      to the homepage
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
