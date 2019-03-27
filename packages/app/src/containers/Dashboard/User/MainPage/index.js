/**
 *
 * MainPage
 *
 */

import React, { Fragment } from 'react';
import { Container, Alert } from 'reactstrap';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard } from '@fortawesome/free-regular-svg-icons';

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
              <Alert color="warning" fade={false} className="text-center">
                <strong>
                  <FontAwesomeIcon
                    icon={faCreditCard}
                    className="mr-2"
                    size="lg"
                  />
                  Please{' '}
                  <Link
                    to="/dashboard/settings/billing"
                    hidden={userProfile._subscription !== null}
                  >
                    upgrade your account
                  </Link>{' '}
                  to continue using PRODUCT_NAME.
                </strong>
              </Alert>
              <h1>Main</h1>
            </Container>
          )}
        </GlobalConsumer>
      </Fragment>
    );
  }
}

MainPage.propTypes = {};
