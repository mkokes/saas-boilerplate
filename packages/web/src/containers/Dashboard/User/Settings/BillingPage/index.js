/**
 *
 * BillingPage
 *
 */

import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet';

import { Row, Col, Card, Table, Button, Alert } from 'reactstrap';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { ApolloConsumer } from 'react-apollo';
import { toast } from 'react-toastify';
import ReactTable from 'react-table';

import { GlobalConsumer } from 'GlobalState';
import { ReactstrapCheckbox } from 'utils/formiik';
import { UpdateUserNotificationsPreferences } from 'graphql/mutations';
import { transformApolloErr } from 'utils/apollo';
import SafeQuery from 'components/graphql/SafeQuery';
import { UserSubscriptionQuery } from 'graphql/queries';

/* eslint-disable react/prefer-stateless-function */
export default class BillingPage extends React.PureComponent {
  render() {
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
                          <SafeQuery
                            query={UserSubscriptionQuery}
                            fetchPolicy="network-only"
                          >
                            {({ data }) => (
                              <Fragment>
                                <div className="float-right">
                                  <Button className="mr-2">
                                    Update Payment Method
                                  </Button>
                                  <Button color="danger">
                                    Cancel Subscription
                                  </Button>
                                </div>
                                <p>
                                  Current plan: <strong>Annual</strong>
                                </p>
                                <p>
                                  Billing period:{' '}
                                  <strong>
                                    August 29, 2018 - September 29, 2018
                                  </strong>
                                </p>
                              </Fragment>
                            )}
                          </SafeQuery>
                        )}
                      </Col>
                    </Row>
                    <legend>Subscription plans</legend>
                    <Row>
                      <Col>
                        <Table borderless>
                          <tbody>
                            <tr>
                              <th scope="row">Monthly Plan</th>
                              <td>$10.00/month</td>
                              <td>
                                <Button
                                  color="primary"
                                  onClick={() => {
                                    window.Paddle.Checkout.open({
                                      product: 548124,
                                      email: userProfile.email,
                                      passthrough: JSON.stringify(userProfile),
                                      success: '/thank-you/',
                                    });
                                  }}
                                >
                                  Upgrade
                                </Button>
                              </td>
                            </tr>
                            <tr>
                              <th scope="row">Annual Plan</th>
                              <td>$20.00/month</td>
                              <td>
                                <Button
                                  color="primary"
                                  onClick={() => {
                                    window.Paddle.Checkout.open({
                                      product: 548125,
                                      email: userProfile.email,
                                      passthrough: JSON.stringify(userProfile),
                                      success: '/thank-you/',
                                    });
                                  }}
                                >
                                  Upgrade
                                </Button>
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </Col>
                    </Row>
                    <legend>Receipts</legend>
                    <Row>
                      <Col>
                        <ReactTable
                          data={[
                            {
                              date: '22/12/2018',
                              amount: '9.99 USD',
                              currency: 'USD',
                              receipt_url: 'https://google.es/receipt.pdf',
                            },
                          ]}
                          columns={[
                            {
                              Header: 'Date',
                              accessor: 'date',
                              getTdProps: () => ({
                                className: 'text-center',
                              }),
                            },
                            {
                              Header: 'Amount',
                              accessor: 'amount',
                            },
                            {
                              Header: 'View receipt',
                              accessor: 'receipt_url',
                              Cell: row => (
                                <a
                                  href="#download"
                                  onClick={() => alert(row.value)}
                                >
                                  <FontAwesomeIcon icon={faFileAlt} size="2x" />
                                </a>
                              ),
                            },
                          ]}
                          getTrProps={() => ({
                            className: 'align-items-center text-center',
                          })}
                          minRows={[1].length > 0 ? 1 : 3}
                          defaultPageSize={3}
                          showPageJump={false}
                          noDataText="No invoices found"
                          className="-striped -highlight"
                        />
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
