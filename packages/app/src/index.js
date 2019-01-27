/**
 * index.js
 *
 * This is the entry file for the application
 */

import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import 'sanitize.css/sanitize.css';
import { ApolloProvider } from 'react-apollo';
import { ThemeProvider } from 'styled-components';
import { ToastContainer } from 'react-toastify';
import MomentTimezone from 'moment-timezone';

import 'bootstrap/dist/css/bootstrap.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-table/react-table.css';
import 'react-confirm-alert/src/react-confirm-alert.css';

import * as serviceWorker from 'serviceWorker';

import { AnalyticsApi } from 'api/vendors';

import { GlobalProvider } from 'GlobalState';
import GlobalStyle from 'GlobalStyle';

import App from 'App';
import { clientInstance } from './graphql';

const APP_THEME = {
  primaryColor: '#764ABC',
  secondaryColor: '#40216F',
  color3: '#6e76ff',
  color4: '#6f2dd9',
};

MomentTimezone.tz.setDefault('America/Los_Angeles');
AnalyticsApi.mixpanel.setup();

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

serviceWorker.unregister();
