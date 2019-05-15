import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { ThemeProvider } from 'styled-components';
import { ToastContainer } from 'react-toastify';
import MomentTimezone from 'moment-timezone';
import * as Sentry from '@sentry/browser';

import 'sanitize.css/sanitize.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-table/react-table.css';
import 'react-confirm-alert/src/react-confirm-alert.css';

import { AnalyticsApi, PaddleApi } from 'api/vendors';
import { GlobalProvider } from 'GlobalState';
import GlobalStyle from 'GlobalStyle';
import App from 'App';
import MaintenancePage from 'pages/MaintenancePage/Loadable';
import config from 'config';
import { clientInstance } from './graphql';

const { NODE_ENV } = process.env;
const { SENTRY_DSN, MAINTENANCE_MODE } = config;

const APP_THEME = {
  primaryColor: '#764ABC',
  secondaryColor: '#40216F',
  color3: '#6e76ff',
  color4: '#6f2dd9',
};

Sentry.init({
  dsn: SENTRY_DSN,
  environment: NODE_ENV,
});

if (!MAINTENANCE_MODE) {
  MomentTimezone.tz.setDefault('America/Los_Angeles');
  AnalyticsApi.mixpanel.setup();
  PaddleApi.setup();

  ReactDOM.render(
    <ApolloProvider client={clientInstance}>
      <GlobalProvider>
        <ThemeProvider theme={APP_THEME}>
          <Fragment>
            <ToastContainer />
            <App />
            <GlobalStyle />
          </Fragment>
        </ThemeProvider>
      </GlobalProvider>
    </ApolloProvider>,
    document.getElementById('app'),
  );
} else {
  ReactDOM.render(
    <ThemeProvider theme={APP_THEME}>
      <Fragment>
        <MaintenancePage />
        <GlobalStyle />
      </Fragment>
    </ThemeProvider>,
    document.getElementById('app'),
  );
}
