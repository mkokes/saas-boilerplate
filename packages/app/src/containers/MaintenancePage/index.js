/**
 *
 * MaintenancePage
 *
 */

import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { Container, Card, CardHeader, CardBody } from 'reactstrap';
import styled from 'styled-components';

import config from 'config';

const { WEBSITE_URL } = config;

const MainContainer = styled(Container)`
  min-height: 100vh;
`;

/* eslint-disable react/prefer-stateless-function */
export default class MaintenancePage extends React.PureComponent {
  componentDidMount() {
    if (window.location.pathname !== '/maintenance')
      window.location.replace('/maintenance');
  }

  render() {
    return (
      <Fragment>
        <Helmet>
          <title>Maintenance mode</title>
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <MainContainer
          tag="main"
          className="flex flex-column justify-content-center"
        >
          <div>
            <Card>
              <CardHeader>
                <strong>Under maintenance</strong>
              </CardHeader>
              <CardBody className="text-center">
                <a href={WEBSITE_URL}>
                  <img
                    src="/logo.png"
                    alt="brand logo"
                    width="112"
                    height="112"
                  />
                </a>
                <h1
                  style={{ fontSize: '2.5em' }}
                  className="mt-1 mb-2 color-primary-theme"
                >
                  Maintenance Mode
                </h1>
                <p
                  style={{ fontSize: '1.5em', fontWeight: 500 }}
                  className="mb-5 color-secondary-theme"
                >
                  We are performing scheduled maintenance. We will be back
                  online shortly!
                </p>
                <a href={WEBSITE_URL}>Go to homepage</a>
              </CardBody>
            </Card>
          </div>
        </MainContainer>
      </Fragment>
    );
  }
}

MaintenancePage.propTypes = {};
