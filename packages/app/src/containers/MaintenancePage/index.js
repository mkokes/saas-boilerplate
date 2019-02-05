/**
 *
 * MaintenancePage
 *
 */

import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { Container, Card } from 'reactstrap';
import styled from 'styled-components';

const MainContainer = styled(Container)`
  min-height: 100vh;
  color: ${props => props.theme.primaryColor};
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
            <Card body className="text-center">
              <a href={process.env.REACT_APP_WEBSITE_URL}>
                <img
                  src="/logo.png"
                  alt="brand logo"
                  width="112"
                  height="112"
                />
              </a>
              <h1 style={{ fontSize: '2.5em' }}>Maintenance Mode</h1>
              <p style={{ fontSize: '1.5em' }}>
                We are performing scheduled maintenance. We will be back online
                shortly!
              </p>
              <a href={process.env.REACT_APP_WEBSITE_URL}>
                Go back to homepage
              </a>
            </Card>
          </div>
        </MainContainer>
      </Fragment>
    );
  }
}

MaintenancePage.propTypes = {};
