/**
 *
 * MainPage
 *
 */

import React, { Fragment } from 'react';
import { Container, Alert, Card } from 'reactstrap';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard } from '@fortawesome/free-regular-svg-icons';
import _ from 'lodash';
import Moment from 'react-moment';
import moment from 'moment';

import { GlobalConsumer } from 'GlobalState';

/* eslint-disable react/prefer-stateless-function */
export default class MainPage extends React.PureComponent {
  render() {
    return (
      <Fragment>
        <Helmet>
          <title>Dashboard index</title>
        </Helmet>
        <GlobalConsumer>
          {({ userProfile }) => (
            <Container tag="main">
              <Alert
                color="primary"
                fade={false}
                className="text-center"
                hidden={
                  !(
                    !_.isEmpty(userProfile._subscription) &&
                    userProfile._subscription._plan.name === 'TRIAL' &&
                    moment(
                      Number(userProfile._subscription.servicePeriodEnd),
                    ).diff(new Date(), 'days') <= 3
                  )
                }
              >
                <span role="img" aria-label="bell icon">
                  🔔
                </span>
                <strong>
                  You have only{' '}
                  <Moment
                    date={
                      userProfile._subscription &&
                      Number(userProfile._subscription.servicePeriodEnd)
                    }
                    diff={new Date()}
                    unit="days"
                  />{' '}
                  day(s) left in your trial!{' '}
                  <Link to="/dashboard/settings/billing">
                    Upgrade your plan
                  </Link>{' '}
                </strong>
              </Alert>
              <Alert
                color="warning"
                fade={false}
                className="text-center"
                hidden={!_.isEmpty(userProfile._subscription)}
              >
                <FontAwesomeIcon
                  icon={faCreditCard}
                  className="mr-2"
                  size="lg"
                />
                <strong>
                  Please{' '}
                  <Link to="/dashboard/settings/billing">
                    upgrade your account
                  </Link>{' '}
                  to continue using PRODUCT_NAME
                </strong>
              </Alert>
              <h1>Main</h1>
              <Card body />
            </Container>
          )}
        </GlobalConsumer>
      </Fragment>
    );
  }
}

MainPage.propTypes = {};
