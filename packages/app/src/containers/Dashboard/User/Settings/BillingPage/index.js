/**
 *
 * BillingPage
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Container, Row, Col, Card, Button, Alert } from 'reactstrap';
import {
  faFileAlt,
  faQuestionCircle,
  faCreditCard,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactTable from 'react-table';
import Moment from 'react-moment';
import { ApolloConsumer } from 'react-apollo';
import { toast } from 'react-toastify';
import queryString from 'query-string';
import { NavLink } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';

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

    const { success } = queryString.parse(location.search);

    // eslint-disable-next-line default-case
    switch (success) {
      case 'subscribed':
        toast.success('Subscribed successfully', {
          position: toast.POSITION.TOP_CENTER,
        });
        break;
      case 'plan_change':
        toast.success('Plan changed successfully', {
          position: toast.POSITION.TOP_CENTER,
        });

        break;
    }

    this.state = {
      subscriptionPlansLoading: false,
    };
    this.renderSubscriptionPlans = this.renderSubscriptionPlans.bind(this);
  }

  renderSubscriptionPlans(currentSubscription, plans) {
    const { history } = this.props;

    const _renderPlanActionButton = plan => {
      if (
        !currentSubscription ||
        currentSubscription.paymentStatus === 'deleted'
      ) {
        return (
          <Button
            color="primary"
            block
            onClick={() =>
              PaddleCheckoutAPI.checkout(plan._paddleProductId, () => {
                history.replace(`/processing`);

                setTimeout(() => {
                  history.replace(
                    '/dashboard/settings/billing?success=subscribed',
                  );
                }, 3000);
              })
            }
          >
            Subscribe
          </Button>
        );
      }

      if (
        currentSubscription &&
        currentSubscription._plan._paddleProductId === plan._paddleProductId
      ) {
        return (
          <Button color="secondary" disabled block>
            Current Plan
          </Button>
        );
      }

      let ctaButton = {
        text: 'Change Plan',
        confirmAlert: {
          title: 'Confirm plan change',
        },
      };

      if (plan.tier > currentSubscription._plan.tier) {
        ctaButton = {
          text: `Upgrade`,
          confirmAlert: {
            title: 'Confirm upgrade',
            message:
              'If chosen plan price is higher than your current plan then price will be pro-rate and bill immediately.',
          },
        };
      }
      if (plan.tier < currentSubscription._plan.tier) {
        ctaButton = {
          text: 'Downgrade',
          confirmAlert: {
            title: 'Confirm downgrade',
            message:
              'Are you sure that you want to downgrade? you will lose all benefits of your current plan.',
          },
        };
      }

      return (
        <ApolloConsumer>
          {client => (
            <Button
              color="primary"
              block
              onClick={() => {
                confirmAlert({
                  title: ctaButton.confirmAlert.title,
                  message: ctaButton.confirmAlert.message,
                  buttons: [
                    {
                      label: 'Confirm',
                      onClick: async () => {
                        this.setState({ subscriptionPlansLoading: true });

                        try {
                          await client.mutate({
                            mutation: ChageUserSubscriptionPlan,
                            variables: {
                              planId: plan._id,
                            },
                          });

                          history.replace(`/processing`);
                          setTimeout(() => {
                            history.replace(
                              '/dashboard/settings/billing?success=plan_change',
                            );
                          }, 3000);
                        } catch (e) {
                          const err = transformApolloErr(e);

                          toast.error(err.message, {
                            position: toast.POSITION.TOP_CENTER,
                          });
                          this.setState({ subscriptionPlansLoading: false });
                        }
                      },
                    },
                    {
                      label: 'Cancel',
                    },
                  ],
                });
              }}
            >
              {ctaButton.text}
            </Button>
          )}
        </ApolloConsumer>
      );
    };

    return plans.map(plan => (
      <Card body className="p-2 pl-3 pr-3 mb-2">
        <Row
          key={plan._id}
          className="mt-2 mb-2 text-center text-md-left align-items-center"
        >
          <Col xs="12" md="3">
            <strong>{plan.name}</strong>
          </Col>
          <Col xs="12" md="5">
            ${plan.price.toFixed(2)}{' '}
            <span className="text-muted">/ {plan.billingInterval}</span>
          </Col>
          <Col xs="12" md="4">
            {_renderPlanActionButton(plan)}
          </Col>
        </Row>
      </Card>
    ));
  }

  render() {
    const { subscriptionPlansLoading } = this.state;

    return (
      <Fragment>
        <Helmet>
          <title>BillingPage</title>
        </Helmet>
        <GlobalConsumer>
          {({ userProfile }) => (
            <Fragment>
              <h1 className="mb-3">Billing</h1>
              <Card body>
                <legend>Current subscription plan</legend>
                <Row>
                  <Col>
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
                                  {userProfile.isInTrialPeriod ? (
                                    <Fragment>
                                      You are currently using trial version
                                    </Fragment>
                                  ) : (
                                    <Fragment>
                                      You don&#39;t have an active subscription
                                      at this time
                                    </Fragment>
                                  )}
                                </strong>
                              </Alert>
                            );
                          }

                          return (
                            <Fragment>
                              {subscription.paymentStatus === 'past_due' && (
                                <Alert color="danger">
                                  <strong>
                                    IMPORTANT: Unfortunately, we could not bill
                                    you. Please, update your payment method
                                    before it is too late and we cancel your
                                    current subscription.
                                  </strong>
                                </Alert>
                              )}

                              <Row>
                                <Col sm="12" md="6">
                                  <p>
                                    Current plan:{' '}
                                    <strong>{subscription._plan.name}</strong>
                                  </p>
                                  <p>
                                    Valid until:{' '}
                                    <strong>
                                      <Moment
                                        format="LL"
                                        date={Number(subscription.accessUntil)}
                                      />
                                    </strong>
                                  </p>
                                  {subscription.paymentStatus === 'active' && (
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
                                  )}
                                  {subscription.paymentStatus !== 'deleted' && (
                                    <p>
                                      Required payment amount:{' '}
                                      <strong>
                                        ${subscription.unitPrice.toFixed(2)}
                                      </strong>
                                    </p>
                                  )}
                                  {subscription.paymentStatus === 'deleted' && (
                                    <p>
                                      Payment method status:{' '}
                                      <strong className="text-danger">
                                        Cancelled
                                      </strong>
                                    </p>
                                  )}
                                </Col>
                                <Col sm="12" md="6">
                                  <span>
                                    {subscription.paymentStatus !==
                                      'deleted' && (
                                      <Button
                                        onClick={() =>
                                          PaddleCheckoutAPI.open(
                                            subscription.updateURL,
                                          )
                                        }
                                        className="mr-2"
                                      >
                                        <FontAwesomeIcon icon={faCreditCard} />
                                        {'  '}
                                        Update Payment Method
                                      </Button>
                                    )}
                                  </span>
                                  {subscription.paymentStatus === 'active' && (
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
                                  )}
                                </Col>
                              </Row>
                            </Fragment>
                          );
                        }}
                      </SafeQuery>
                    </Fragment>
                  </Col>
                </Row>
                <legend>
                  Plans{' '}
                  <NavLink to="/pricing" className="float-right">
                    <small>
                      Pricing page{' '}
                      <FontAwesomeIcon icon={faQuestionCircle} size="xs" />
                    </small>
                  </NavLink>{' '}
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
                      {({ data: { currentSubscription, plans = [] } }) => (
                        <Container>
                          {this.renderSubscriptionPlans(
                            currentSubscription,
                            plans,
                          )}
                        </Container>
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
                                Cell: row => (
                                  <span>
                                    ${parseInt(row.value, 10).toFixed(2)}
                                  </span>
                                ),
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
