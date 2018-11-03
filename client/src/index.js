/**
 * index.js
 *
 * This is the entry file for the application
 */

import React from 'react';
import ReactDOM from 'react-dom';
import 'sanitize.css/sanitize.css';
import { ApolloProvider } from 'react-apollo';

import { AnalyticsApi } from 'api/vendors';

import { GlobalProvider } from 'GlobalState';
import GlobalStyle from 'GlobalStyle';

import { clientInstance } from './graphql';
import App from './App';

import registerServiceWorker from './registerServiceWorker';

AnalyticsApi.setup();

ReactDOM.render(
  <ApolloProvider client={clientInstance}>
    <GlobalProvider>
      <App />
      <GlobalStyle />
    </GlobalProvider>
  </ApolloProvider>,
  document.getElementById('app'),
);

registerServiceWorker();
