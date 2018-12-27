/**
 *
 * BillingPage
 *
 */

import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet';

import { Row, Col, Card, Button, Alert, UncontrolledTooltip } from 'reactstrap';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ApolloConsumer } from 'react-apollo';
import ReactTable from 'react-table';
import Moment from 'react-moment';
import Switch from 'react-switch';

import { GlobalConsumer } from 'GlobalState';
import SafeQuery from 'components/graphql/SafeQuery';
import {
  UserSubscriptionQuery,
  UserPaymentReceipts,
  ActiveSubscriptionPlans,
} from 'graphql/queries';
import { PaddleCheckoutAPI } from 'api/vendors';

/* eslint-disable react/prefer-stateless-function */
export default class BillingPage extends React.PureComponent {
  constructor() {
    super();

    this.state = { checked: true };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(checked) {
    this.setState({ checked });
  }

  render() {
    const { checked } = this.state;

    const renderPlanActionButton = (plan, user) => {
      const { _subscription } = user;

      if (!_subscription) {
        return (
          <Button
            color="primary"
            onClick={() => PaddleCheckoutAPI.checkout(plan._paddleProductId)}
          >
            Subscribe
          </Button>
        );
      }

      if (_subscription && _subscription._plan._id === plan._id) {
        return <span>Your current plan</span>;
      }

      return (
        <Button
          color="primary"
          onClick={() => {
            alert('change plan req');
          }}
        >
          Change Plan
        </Button>
      );
    };

    return (
      <Fragment>
        <Helmet>
          <title>BillingPage</title>
          <meta name="description" content="Description of BillingPage" />
        </Helmet>
        <ApolloConsumer>
          {client => (
            <GlobalConsumer>
              {({ setUserProfile, userProfile }) => (
                <Fragment>
                  <h1 className="mb-3">Billing</h1>
                  <Card body>
                    <legend>Current subscription plan</legend>
                    <Row>
                      <Col>
                        {userProfile.isInTrialPeriod ? (
                          <Alert
                            color="warning"
                            className="text-center"
                            fade={false}
                          >
                            <strong>You are currently in trial period</strong>
                          </Alert>
                        ) : (
                          <Fragment>
                            {userProfile._subscription._id ? (
                              <SafeQuery
                                query={UserSubscriptionQuery}
                                fetchPolicy="network-only"
                                showLoading
                                showError
                              >
                                {({ data: { subscription = {} } }) => (
                                  <Fragment>
                                    {subscription.status === 'past_due' && (
                                      <Alert color="danger">
                                        <strong>
                                          IMPORTANT: Unfortunately, we could not
                                          bill you again. Please, update your
                                          payment method before it is too late
                                          and we cancel your current
                                          subscription.
                                        </strong>
                                      </Alert>
                                    )}

                                    <span className="float-right">
                                      <a href={subscription.updateURL}>
                                        <Button className="mr-2">
                                          Update Payment Method
                                        </Button>
                                      </a>
                                      <a href={subscription.cancelURL}>
                                        <Button
                                          color="link"
                                          size="sm"
                                          className="d-block"
                                        >
                                          Cancel Subscription
                                        </Button>
                                      </a>
                                    </span>
                                    <p>
                                      Current plan:{' '}
                                      <strong>{subscription._plan.name}</strong>
                                    </p>
                                    <p>
                                      Price:{' '}
                                      <strong>
                                        ${subscription.unitPrice.toFixed(2)}/
                                        {subscription._plan.billingInterval}
                                      </strong>
                                    </p>
                                    <p>
                                      Next payment date at:{' '}
                                      <strong>
                                        <Moment
                                          format="LL"
                                          date={Number(
                                            subscription.nextBillDateAt,
                                          )}
                                        />
                                      </strong>
                                    </p>
                                  </Fragment>
                                )}
                              </SafeQuery>
                            ) : (
                              <Alert color="info" className="text-center">
                                <strong>
                                  You don&#39;t have an active subscription
                                </strong>
                              </Alert>
                            )}
                          </Fragment>
                        )}
                      </Col>
                    </Row>
                    <legend>
                      Subscription plans{' '}
                      <label
                        htmlFor="normal-switch"
                        id="billing-switch"
                        className="d-flex align-items-center float-right"
                      >
                        <Switch
                          onChange={this.handleChange}
                          checked={this.state.checked}
                          onColor="#7EB6FF"
                          uncheckedIcon={false}
                          checkedIcon={false}
                          id="normal-switch"
                          className="mr-1"
                        />

                        <small>{checked ? 'Yearly' : 'Monthly'}</small>
                      </label>
                      <UncontrolledTooltip
                        placement="top"
                        target="billing-switch"
                      >
                        Switch to {checked ? 'monthly' : 'yearly'} billing
                      </UncontrolledTooltip>
                    </legend>

                    <Row>
                      <Col>
                        <SafeQuery
                          query={ActiveSubscriptionPlans}
                          fetchPolicy="network-only"
                          showLoading
                          showError
                        >
                          {({ data: { plans = [] } }) => (
                            <Fragment>
                              {plans.map(plan => (
                                <Row key={plan._id}>
                                  <Col>{plan.name}</Col>
                                  <Col>
                                    ${plan.price.toFixed(2)}/
                                    {plan.billingInterval}
                                  </Col>
                                  <Col>
                                    {renderPlanActionButton(plan, userProfile)}
                                  </Col>
                                </Row>
                              ))}
                            </Fragment>
                          )}
                        </SafeQuery>
                      </Col>
                    </Row>
                    <legend>Receipts</legend>
                    <Row>
                      <Col>
                        <SafeQuery
                          query={UserPaymentReceipts}
                          fetchPolicy="cache-and-network"
                          showLoading
                          showError
                        >
                          {({ data: { payments = [] } }) => (
                            <Fragment>
                              <ReactTable
                                data={payments}
                                columns={[
                                  {
                                    Header: 'Date',
                                    accessor: 'receivedAt',
                                    getTdProps: () => ({
                                      className: 'text-center',
                                    }),
                                    Cell: row => (
                                      <Moment
                                        format="L"
                                        date={Number(row.value)}
                                      />
                                    ),
                                  },
                                  {
                                    Header: 'Amount',
                                    accessor: 'saleGross',
                                    Cell: row => <span>${row.value}</span>,
                                  },
                                  {
                                    Header: 'View receipt',
                                    accessor: 'receiptURL',
                                    Cell: row => (
                                      <a
                                        href={row.value}
                                        style={{ color: '#808080' }}
                                      >
                                        <FontAwesomeIcon
                                          icon={faFileAlt}
                                          size="2x"
                                        />
                                      </a>
                                    ),
                                  },
                                ]}
                                getTrProps={() => ({
                                  className: 'align-items-center text-center',
                                })}
                                minRows={payments.length > 0 ? 1 : 3}
                                defaultPageSize={3}
                                showPageJump={false}
                                noDataText="No invoices found"
                                className="-striped -highlight"
                              />
                            </Fragment>
                          )}
                        </SafeQuery>
                      </Col>
                    </Row>
                  </Card>
                </Fragment>
              )}
            </GlobalConsumer>
          )}
        </ApolloConsumer>
      </Fragment>
    );
  }
}

BillingPage.propTypes = {};
