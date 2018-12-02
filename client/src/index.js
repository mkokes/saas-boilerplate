/**
 * index.js
 *
 * This is the entry file for the application
 */

import React from 'react';
import ReactDOM from 'react-dom';
import 'sanitize.css/sanitize.css';
import { ApolloProvider } from 'react-apollo';
// import FontFaceObserver from 'fontfaceobserver';
import 'bootstrap/dist/css/bootstrap.css';

import { AnalyticsApi } from 'api/vendors';

import { GlobalProvider } from 'GlobalState';
import GlobalStyle from 'GlobalStyle';

import { clientInstance } from './graphql';
import App from './app';
import registerServiceWorker from './registerServiceWorker';

// Observe font loading
/* const robotoFontObserver = new FontFaceObserver('Roboto', {});
robotoFontObserver.load().then(() => {
  document.body.classList.add('fontLoaded');
}); */

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
