/**
 *
 * BillingPage
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import {
  faFileAlt,
  faQuestionCircle,
  faCreditCard,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { faBitcoin } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactTable from 'react-table';
import Moment from 'react-moment';
import { withApollo, ApolloConsumer } from 'react-apollo';
import { toast } from 'react-toastify';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import Switch from 'react-switch';
import { Formik, Form, Field } from 'formik';
import CoinbaseCommerceButton from 'react-coinbase-commerce';
import 'react-coinbase-commerce/dist/coinbase-commerce-button.css';

import { capitalizeFirstLetter } from 'utils/string';
import { ReactstrapSelect } from 'utils/formiik';
import { getProvider as getGlobalProvider } from 'GlobalState';
import SafeQuery from 'components/graphql/SafeQuery';
import Loader from 'components/Loader';
import {
  BILLING_CURRENT_SUBSCRIPTION,
  USER_PAYMENTS_RECEIPT_QUERY,
  BILLING_SHOW_PLANS_QUERY,
  USER_SUBSCRIPTION_PLAN,
  PLANS_QUERY,
} from 'graphql/queries';
import { PaddleApi } from 'api/vendors';
import {
  CANCEL_SUBSCRIPTION_RENEWAL,
  CHANGE_USER_SUBSCRIPTION_PLAN,
  CREATE_COINBASE_COMMERCE_CHARGE,
} from 'graphql/mutations';
import { transformApolloErr } from 'utils/apollo';
import { displayBillingInterval } from 'utils/core';

/* eslint-disable react/prefer-stateless-function */
class BillingPage extends React.PureComponent {
  constructor(props) {
    super(props);

    const { location } = props;
    const { interval } = queryString.parse(location.search);

    let billingIntervalToggler;
    // eslint-disable-next-line default-case
    switch (interval) {
      case 'yearly':
        billingIntervalToggler = true;
        break;
      case 'monthly':
        billingIntervalToggler = false;
        break;
    }

    this.state = {
      subscriptionPlansLoading: false,
      billingIntervalToggler,
      payWithCryptoModal: false,
      coinbaseChargeId: null,
    };
    this.handleChangeBillingIntervalToggler = this.handleChangeBillingIntervalToggler.bind(
      this,
    );
    this.renderSubscriptionPlans = this.renderSubscriptionPlans.bind(this);
    this.togglePayWithCryptoModal = this.togglePayWithCryptoModal.bind(this);
  }

  async componentDidMount() {
    const { location, client: apolloClient } = this.props;
    const { billingIntervalToggler } = this.state;

    const { success } = queryString.parse(location.search);

    // eslint-disable-next-line default-case
    switch (success) {
      case 'subscribed':
        toast.success('You are now subscribed.', {
          position: toast.POSITION.TOP_CENTER,
        });
        break;
      case 'plan_change':
        toast.success('Plan was changed successfully.', {
          position: toast.POSITION.TOP_CENTER,
        });
        break;
      case 'subscription_renewal_cancelled':
        toast.success('Subscription renewal was cancelled successfully.', {
          position: toast.POSITION.TOP_CENTER,
        });
        break;
    }

    if (billingIntervalToggler !== undefined) return;

    const globalProvider = await getGlobalProvider();
    const user = await globalProvider.state.auth.profile;

    if (user._subscription) {
      try {
        const {
          data: { plan },
        } = await apolloClient.query({
          query: USER_SUBSCRIPTION_PLAN,
          fetchPolicy: 'network-only',
        });

        this.setState({
          billingIntervalToggler:
            plan.billingInterval !== 'monthly' && plan.billingInterval !== null,
        });

        // eslint-disable-next-line no-empty
      } catch (_) {}
    }
  }

  handleChangeBillingIntervalToggler(billingIntervalToggler) {
    this.setState({ billingIntervalToggler });
  }

  togglePayWithCryptoModal() {
    this.setState(prevState => ({
      payWithCryptoModal: !prevState.payWithCryptoModal,
    }));
  }

  renderSubscriptionPlans(currentPlan, currentSubscription, plans) {
    const { history } = this.props;
    const { billingIntervalToggler } = this.state;

    const _renderPlanActionButton = (plan, isCurrentPlan) => {
      if (!currentSubscription || currentPlan.name === 'TRIAL') {
        return (
          <Button
            color="primary"
            block
            onClick={() =>
              PaddleApi.checkout(plan._paddleProductId, () => {
                history.replace(`/processing`);

                setTimeout(() => {
                  history.replace(
                    '/dashboard/settings/billing?success=subscribed',
                  );
                }, 3000);
              })
            }
          >
            <strong>Subscribe</strong>
          </Button>
        );
      }

      if (isCurrentPlan && currentSubscription.paymentMethod !== 'manually') {
        return (
          <Button color="primary" disabled block>
            Current Plan
          </Button>
        );
      }

      if (currentSubscription.paymentStatus === 'deleted') {
        return (
          <Button
            color="primary"
            block
            onClick={() =>
              confirmAlert({
                title: 'Confirm subscription',
                message:
                  'Are you sure you want to start a new subscription? your current subscription will be ended.',
                buttons: [
                  {
                    label: 'Confirm',
                    onClick: async () =>
                      PaddleApi.checkout(plan._paddleProductId, () => {
                        history.replace(`/processing`);

                        setTimeout(() => {
                          history.replace(
                            '/dashboard/settings/billing?success=subscribed',
                          );
                        }, 3000);
                      }),
                  },
                  {
                    label: 'Cancel',
                  },
                ],
              })
            }
          >
            <strong>Subscribe</strong>
          </Button>
        );
      }

      if (
        plan.billingInterval === 'monthly' &&
        currentPlan.billingInterval === 'yearly'
      ) {
        return (
          <Fragment>
            <Button color="primary" disabled block>
              Change from annual plan to monthly plan is not allowed
            </Button>
          </Fragment>
        );
      }

      let ctaButton = {
        text: 'Change Plan',
        confirmAlert: {
          title: 'Confirm plan change',
        },
      };

      if (plan.tier > currentPlan.tier || plan.price > currentPlan.price) {
        ctaButton = {
          text: `Upgrade`,
          confirmAlert: {
            title: 'Confirm upgrade',
            message:
              'As chosen plan price is higher than your current plan then price will be pro-rate and bill immediately.',
          },
        };
      }
      if (plan.tier < currentPlan.tier) {
        ctaButton = {
          text: 'Downgrade',
          confirmAlert: {
            title: 'Confirm downgrade',
            message:
              'Are you sure you want to downgrade? you will lose all benefits of your current plan.',
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
                            mutation: CHANGE_USER_SUBSCRIPTION_PLAN,
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

    return plans.map(plan => {
      const isCurrentPlan =
        currentSubscription &&
        (currentSubscription.paymentStatus !== 'deleted' ||
          currentSubscription.paymentMethod === 'manually') &&
        currentPlan._id === plan._id;

      return (
        <Card
          body
          className="p-2 pl-3 pr-3 mb-2"
          key={plan._id}
          outline
          color={isCurrentPlan ? 'primary' : undefined}
          style={{
            border: isCurrentPlan ? '2px solid' : undefined,
          }}
          hidden={
            plan.billingInterval ===
            (billingIntervalToggler ? 'monthly' : 'yearly')
          }
        >
          <Row
            key={plan._id}
            className="mt-2 mb-2 text-center text-md-left align-items-center"
          >
            <Col xs="12" md="3" style={{ fontSize: '20px' }}>
              <strong>{plan.displayName}</strong>
            </Col>
            <Col xs="12" md="5" style={{ fontSize: '19px' }}>
              ${plan.price.toFixed(2)}{' '}
              <span className="text-muted">
                / {displayBillingInterval(plan.billingInterval)}
              </span>
            </Col>
            <Col xs="12" md="4">
              {_renderPlanActionButton(plan, isCurrentPlan)}
            </Col>
          </Row>
        </Card>
      );
    });
  }

  render() {
    const { history } = this.props;
    const {
      subscriptionPlansLoading,
      billingIntervalToggler,
      payWithCryptoModal,
      coinbaseChargeId,
    } = this.state;

    return (
      <Fragment>
        <Helmet>
          <title>BillingPage</title>
        </Helmet>
        <Fragment>
          <h1 className="mb-3">Billing</h1>
          <ApolloConsumer>
            {client => (
              <Card body>
                <legend>Current Subscription</legend>
                <Row>
                  <Col>
                    <SafeQuery
                      query={BILLING_CURRENT_SUBSCRIPTION}
                      keepExistingResultDuringRefetch
                      fetchPolicy="network-only"
                      showLoading
                      showError
                    >
                      {({ data: { plan, subscription } }) => {
                        if (!subscription) {
                          return (
                            <Alert
                              color="warning"
                              className="text-center"
                              fade={false}
                            >
                              <strong>
                                <Fragment>
                                  You don&#39;t have an active subscription at
                                  this time
                                </Fragment>
                              </strong>
                            </Alert>
                          );
                        }

                        return (
                          <Fragment>
                            <Alert
                              color="danger"
                              hidden={
                                !(
                                  subscription.paymentMethod === 'paddle' &&
                                  subscription.paymentStatus === 'past_due'
                                )
                              }
                            >
                              <strong>
                                IMPORTANT: Unfortunately, we could not bill you.
                                Please, update your payment method before it is
                                too late and we cancel your current
                                subscription.
                              </strong>
                            </Alert>

                            <Row>
                              <Col sm="12" md="6">
                                <p className="mb-0">
                                  Plan name: <strong>{plan.displayName}</strong>
                                </p>
                                <p
                                  className="mb-0"
                                  hidden={
                                    !(subscription.paymentStatus !== 'active')
                                  }
                                >
                                  Access until:{' '}
                                  <strong>
                                    <Moment
                                      format="LL"
                                      date={Number(
                                        subscription.servicePeriodEnd,
                                      )}
                                    />
                                    <span hidden={!(plan.name === 'TRIAL')}>
                                      {' '}
                                      (
                                      <Moment
                                        diff={Number(subscription.startedAt)}
                                        unit="days"
                                      >
                                        {Number(subscription.servicePeriodEnd)}
                                      </Moment>{' '}
                                      days left)
                                    </span>
                                  </strong>
                                </p>
                                <p
                                  className="mb-0"
                                  hidden={
                                    !(
                                      subscription.paymentMethod === 'paddle' &&
                                      subscription.paymentStatus === 'active'
                                    )
                                  }
                                >
                                  Next payment date at:{' '}
                                  <strong>
                                    <Moment
                                      format="LL"
                                      date={Number(subscription.nextBillDateAt)}
                                    />
                                  </strong>
                                </p>
                                <p
                                  className="mb-0"
                                  hidden={
                                    !(
                                      subscription.paymentMethod === 'paddle' &&
                                      subscription.paymentStatus !== 'deleted'
                                    )
                                  }
                                >
                                  Required payment amount:{' '}
                                  <strong>
                                    ${subscription.price.toFixed(2)}
                                  </strong>
                                </p>
                                <p
                                  className="mb-0"
                                  hidden={
                                    !(
                                      subscription.paymentMethod === 'paddle' &&
                                      subscription.paymentStatus === 'deleted'
                                    )
                                  }
                                >
                                  Payment method status:{' '}
                                  <strong className="text-danger">
                                    Renewal cancelled
                                  </strong>
                                </p>
                              </Col>
                              <Col sm="12" md="6" className="mt-3 mt-md-1">
                                <span
                                  hidden={
                                    !(
                                      subscription.paymentMethod === 'paddle' &&
                                      subscription.paymentStatus !== 'deleted'
                                    )
                                  }
                                >
                                  <Button
                                    onClick={() =>
                                      PaddleApi.open(
                                        subscription._paddleUpdateURL,
                                      )
                                    }
                                    className="mr-2"
                                  >
                                    <FontAwesomeIcon icon={faCreditCard} />
                                    {'  '}
                                    Update Payment Method
                                  </Button>
                                </span>
                                <span
                                  hidden={
                                    !(
                                      subscription.paymentMethod === 'paddle' &&
                                      subscription.paymentStatus === 'active'
                                    )
                                  }
                                >
                                  <Button
                                    onClick={() =>
                                      confirmAlert({
                                        title: 'Confirm renewal cancellation',
                                        message:
                                          'If you confirm and end your subscription renewal now, you can still access to it until it expires.',
                                        buttons: [
                                          {
                                            label: 'Confirm',
                                            onClick: async () => {
                                              try {
                                                await client.mutate({
                                                  mutation: CANCEL_SUBSCRIPTION_RENEWAL,
                                                });

                                                history.replace(`/processing`);
                                                setTimeout(() => {
                                                  history.replace(
                                                    '/dashboard/settings/billing?success=subscription_renewal_cancelled',
                                                  );
                                                }, 3000);
                                              } catch (e) {
                                                const err = transformApolloErr(
                                                  e,
                                                );

                                                toast.error(err.message, {
                                                  position:
                                                    toast.POSITION.TOP_CENTER,
                                                });
                                              }
                                            },
                                          },
                                          {
                                            label: 'Cancel',
                                          },
                                        ],
                                      })
                                    }
                                    color="link"
                                    size="sm"
                                    className="d-block text-muted"
                                  >
                                    Cancel subscription renewal
                                  </Button>
                                </span>
                              </Col>
                            </Row>
                          </Fragment>
                        );
                      }}
                    </SafeQuery>
                  </Col>
                </Row>
                <legend className="mt-3 mb-3">
                  Plans{' '}
                  <Link to="/pricing" className="float-right">
                    <small>
                      Pricing page{' '}
                      <FontAwesomeIcon
                        icon={faQuestionCircle}
                        size="xs"
                        className="align-middle"
                      />
                    </small>
                  </Link>
                </legend>
                <Row>
                  <Col hidden={subscriptionPlansLoading}>
                    <SafeQuery
                      query={BILLING_SHOW_PLANS_QUERY}
                      fetchPolicy="network-only"
                      keepExistingResultDuringRefetch
                      showLoading
                      showError
                    >
                      {({
                        data: { currentPlan, currentSubscription, plans = [] },
                      }) => (
                        <Container>
                          <div
                            className="mb-3 text-right"
                            style={{ fontSize: '0.9em' }}
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
                              }}
                              onClick={() =>
                                this.setState({
                                  billingIntervalToggler: false,
                                })
                              }
                            >
                              Monthly
                            </Button>
                            <Switch
                              onChange={this.handleChangeBillingIntervalToggler}
                              checked={
                                billingIntervalToggler !== undefined
                                  ? billingIntervalToggler
                                  : false
                              }
                              uncheckedIcon={false}
                              checkedIcon={false}
                              onColor="#888888"
                              height={18}
                              width={36}
                              className="align-middle mr-2 ml-2"
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
                              }}
                              onClick={() =>
                                this.setState({
                                  billingIntervalToggler: true,
                                })
                              }
                            >
                              Yearly (10% OFF)
                            </Button>
                          </div>
                          {this.renderSubscriptionPlans(
                            currentPlan,
                            currentSubscription,
                            plans,
                          )}
                          <div className="mt-3">
                            <Button
                              color="link"
                              className="p-0 text-muted"
                              onClick={this.togglePayWithCryptoModal}
                            >
                              <FontAwesomeIcon icon={faBitcoin} /> Pay with
                              cryptocurrency
                            </Button>
                            <Modal
                              isOpen={payWithCryptoModal}
                              toggle={this.togglePayWithCryptoModal}
                            >
                              <ModalHeader
                                toggle={this.togglePayWithCryptoModal}
                              >
                                Pay with cryptocurrency
                              </ModalHeader>

                              <SafeQuery
                                query={PLANS_QUERY}
                                keepExistingResultDuringRefetch
                                fetchPolicy="network-only"
                                showLoading
                                showError
                              >
                                {({ data: { plans: availablePlans } }) => (
                                  <Formik
                                    initialValues={{
                                      plan: '',
                                    }}
                                    onSubmit={async (values, formikBag) => {
                                      try {
                                        const {
                                          data: { chargeId },
                                        } = await client.mutate({
                                          mutation: CREATE_COINBASE_COMMERCE_CHARGE,
                                          variables: {
                                            plan: values.plan.value,
                                          },
                                        });

                                        this.setState({
                                          coinbaseChargeId: chargeId,
                                        });
                                      } catch (e) {
                                        const err = transformApolloErr(e);

                                        if (err.type === 'BAD_USER_INPUT') {
                                          formikBag.setErrors(err.data);
                                        }
                                      }

                                      formikBag.setSubmitting(false);
                                    }}
                                  >
                                    {({ values, isSubmitting }) => (
                                      <Fragment>
                                        <Form>
                                          <ModalBody>
                                            <div className="text-center mt-3 mb-3">
                                              <img
                                                src="/images/bitcoin_logo.svg"
                                                alt="bitcoin logo"
                                              />
                                            </div>

                                            <Field
                                              component={ReactstrapSelect}
                                              name="plan"
                                              label="Plans"
                                              options={availablePlans
                                                .filter(
                                                  plan =>
                                                    plan.billingInterval ===
                                                    'yearly',
                                                )
                                                .map(plan => ({
                                                  label: `${
                                                    plan.displayName
                                                  } - $${plan.price.toFixed(
                                                    2,
                                                  )}/year`,
                                                  value: plan._id,
                                                  displayName: plan.displayName,
                                                  price: plan.price,
                                                }))}
                                              value={values.plan}
                                              submitOnChange
                                              required
                                            />
                                            <div className="text-center">
                                              <FontAwesomeIcon
                                                pulse
                                                icon={faSpinner}
                                                className={
                                                  isSubmitting
                                                    ? 'mr-2'
                                                    : 'd-none'
                                                }
                                              />
                                            </div>
                                          </ModalBody>
                                          <ModalFooter
                                            hidden={
                                              !values.plan || isSubmitting
                                            }
                                          >
                                            <CoinbaseCommerceButton
                                              styled
                                              chargeId={coinbaseChargeId}
                                              style={{
                                                fontSize: '17px',
                                              }}
                                              onChargeSuccess={() =>
                                                // eslint-disable-next-line no-alert
                                                alert(
                                                  `Thanks, we received your payment. Your subscription will be enabled soon.`,
                                                )
                                              }
                                            >
                                              <strong>Pay with Crypto</strong>
                                            </CoinbaseCommerceButton>
                                          </ModalFooter>
                                        </Form>
                                      </Fragment>
                                    )}
                                  </Formik>
                                )}
                              </SafeQuery>
                            </Modal>
                          </div>
                        </Container>
                      )}
                    </SafeQuery>
                  </Col>
                  <Col hidden={!subscriptionPlansLoading}>
                    <Loader />
                  </Col>
                </Row>
                <legend className="mt-3">Receipts</legend>
                <Row>
                  <Col>
                    <SafeQuery
                      query={USER_PAYMENTS_RECEIPT_QUERY}
                      fetchPolicy="network-only"
                      keepExistingResultDuringRefetch
                      showLoading
                      showError
                    >
                      {({ data: { payments = [] } }) => (
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
                              Header: 'Payment method',
                              accessor: 'paymentMethod',
                              Cell: row => (
                                <span>{capitalizeFirstLetter(row.value)}</span>
                              ),
                            },
                            {
                              Header: 'Amount',
                              accessor: 'saleGross',
                              Cell: row => <span>${row.value}</span>,
                            },
                            {
                              Header: 'View receipt',
                              accessor: '_paddleReceiptURL',
                              Cell: row =>
                                row.value ? (
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
                                ) : (
                                  <span>–</span>
                                ),
                            },
                          ]}
                          getTrProps={() => ({
                            className: 'align-items-center text-center',
                          })}
                          minRows={payments.length > 0 ? 1 : 3}
                          defaultPageSize={3}
                          showPageJump={false}
                          noDataText="No receipts found"
                          className="-striped -highlight"
                        />
                      )}
                    </SafeQuery>
                  </Col>
                </Row>
              </Card>
            )}
          </ApolloConsumer>
        </Fragment>
      </Fragment>
    );
  }
}

BillingPage.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
  client: PropTypes.object,
};

export default withApollo(BillingPage);
