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

    this.state = { billingSwitchChecked: true };
  }

  render() {
    const { billingSwitchChecked } = this.state;

    return (
      <Fragment>
        <Helmet>
          <title>BillingPage</title>
          <meta name="description" content="Description of BillingPage" />
        </Helmet>
        <GlobalConsumer>
          {({ userProfile }) => (
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
                        <SafeQuery
                          query={UserSubscriptionQuery}
                          fetchPolicy="network-only"
                          showLoading
                          showError
                        >
                          {({ data: { subscription = {} } }) => (
                            <Fragment>
                              {subscription ? (
                                <Fragment>
                                  {subscription.status === 'past_due' && (
                                    <Alert color="danger">
                                      <strong>
                                        IMPORTANT: Unfortunately, we could not
                                        bill you again. Please, update your
                                        payment method before it is too late and
                                        we cancel your current subscription.
                                      </strong>
                                    </Alert>
                                  )}

                                  <span className="float-right">
                                    <Button
                                      onClick={() =>
                                        PaddleCheckoutAPI.open(
                                          subscription.updateURL,
                                        )
                                      }
                                      className="mr-2"
                                    >
                                      Update Payment Method
                                    </Button>
                                    <Button
                                      onClick={() =>
                                        PaddleCheckoutAPI.open(
                                          subscription.cancelURL,
                                        )
                                      }
                                      color="link"
                                      size="sm"
                                      className="d-block"
                                    >
                                      Cancel Subscription
                                    </Button>
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
                              ) : (
                                <Alert
                                  color="warning"
                                  className="text-center"
                                  fade={false}
                                >
                                  <strong>
                                    You don&#39;t have an active subscription at
                                    this time
                                  </strong>
                                </Alert>
                              )}
                            </Fragment>
                          )}
                        </SafeQuery>
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
                      onChange={checked => {
                        this.setState({
                          billingSwitchChecked: checked,
                        });
                      }}
                      checked={this.state.billingSwitchChecked}
                      onColor="#7EB6FF"
                      uncheckedIcon={false}
                      checkedIcon={false}
                      id="normal-switch"
                      className="mr-1"
                    />

                    <small>{billingSwitchChecked ? 'Yearly' : 'Monthly'}</small>
                  </label>
                  <UncontrolledTooltip placement="top" target="billing-switch">
                    Switch to {billingSwitchChecked ? 'monthly' : 'yearly'}{' '}
                    billing
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
                      {({ data: { plans = [] } }) => <Fragment />}
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
                                  <Moment format="L" date={Number(row.value)} />
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
                                    target="_new"
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
      </Fragment>
    );
  }
}

BillingPage.propTypes = {};
