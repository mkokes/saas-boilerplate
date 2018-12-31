/**
 *
 * BillingPage
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Row, Col, Card, Button, Alert, UncontrolledTooltip } from 'reactstrap';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactTable from 'react-table';
import Moment from 'react-moment';
import Switch from 'react-switch';
import { ApolloConsumer } from 'react-apollo';
import { toast } from 'react-toastify';
import queryString from 'query-string';

import { GlobalConsumer } from 'GlobalState';
import SafeQuery from 'components/graphql/SafeQuery';
import Loader from 'components/Loader';
import {
  UserSubscriptionQuery,
  UserPaymentReceipts,
  ActiveSubscriptionPlans,
} from 'graphql/queries';
import { PaddleCheckoutAPI } from 'api/vendors';
import { ChageUserSubscriptionPlan } from 'graphql/mutations';
import { transformApolloErr } from 'utils/apollo';

/* eslint-disable react/prefer-stateless-function */
export default class BillingPage extends React.PureComponent {
  constructor(props) {
    super(props);

    const { location } = props;

    const urlParams = queryString.parse(location.search);
    console.debug(urlParams);
    const { success } = urlParams;

    // eslint-disable-next-line default-case
    switch (success) {
      case 'subscribed':
        toast.success('New subscription created successfully!', {
          position: toast.POSITION.TOP_CENTER,
        });
        break;
      case 'plan_change':
        toast.success('Plan changed successfully!', {
          position: toast.POSITION.TOP_CENTER,
        });

        break;
    }

    this.state = {
      billingSwitchChecked: true,
      subscriptionPlansLoading: false,
    };
    this.renderSubscriptionPlans = this.renderSubscriptionPlans.bind(this);
  }

  renderSubscriptionPlans(currentPlan, plans) {
    const { history } = this.props;

    const _renderPlanActionButton = plan => {
      if (!currentPlan) {
        return (
          <Button
            color="primary"
            onClick={() =>
              PaddleCheckoutAPI.checkout(plan._paddleProductId, () => {
                history.push('/dashboard/settings/billing?success=subscribed');
              })
            }
          >
            Subscribe
          </Button>
        );
      }

      if (
        currentPlan &&
        currentPlan._plan._paddleProductId === plan._paddleProductId
      ) {
        return <strong>Your current plan</strong>;
      }

      return (
        <ApolloConsumer>
          {client => (
            <Button
              color="primary"
              onClick={async () => {
                this.setState({ subscriptionPlansLoading: true });

                try {
                  await client.mutate({
                    mutation: ChageUserSubscriptionPlan,
                    variables: {
                      planId: plan._id,
                    },
                  });

                  history.push(
                    '/dashboard/settings/billing?success=plan_change',
                  );
                } catch (e) {
                  const err = transformApolloErr(e);

                  toast.error(err.message, {
                    position: toast.POSITION.TOP_CENTER,
                  });
                }

                this.setState({ subscriptionPlansLoading: false });
              }}
            >
              Change Plan
            </Button>
          )}
        </ApolloConsumer>
      );
    };

    const { billingSwitchChecked } = this.state;

    const filteredPlans = plans.filter(
      plan => (plan.billingInterval === 'year') === billingSwitchChecked,
    );

    return filteredPlans.map(plan => (
      <Row key={plan._id} className="mb-2">
        <Col>{plan.name}</Col>
        <Col>
          ${plan.price.toFixed(2)}/{plan.billingInterval}
        </Col>
        <Col>{_renderPlanActionButton(plan)}</Col>
      </Row>
    ));
  }

  render() {
    const { billingSwitchChecked, subscriptionPlansLoading } = this.state;

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
                          keepExistingResultDuringRefetch
                          fetchPolicy="network-only"
                          showLoading
                          showError
                        >
                          {({ data: { subscription } }) => {
                            if (!subscription) {
                              return (
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
                              );
                            }

                            return (
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
                                      date={Number(subscription.nextBillDateAt)}
                                    />
                                  </strong>
                                </p>
                              </Fragment>
                            );
                          }}
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
                  <Col hidden={subscriptionPlansLoading}>
                    <SafeQuery
                      query={ActiveSubscriptionPlans}
                      fetchPolicy="network-only"
                      keepExistingResultDuringRefetch
                      showLoading
                      showError
                    >
                      {({ data: { currentPlan, plans = [] } }) => (
                        <Fragment>
                          {this.renderSubscriptionPlans(currentPlan, plans)}
                        </Fragment>
                      )}
                    </SafeQuery>
                  </Col>
                  <Col hidden={!subscriptionPlansLoading}>
                    <Loader />
                  </Col>
                </Row>
                <legend>Receipts</legend>
                <Row>
                  <Col>
                    <SafeQuery
                      query={UserPaymentReceipts}
                      fetchPolicy="network-only"
                      keepExistingResultDuringRefetch
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

BillingPage.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
};
