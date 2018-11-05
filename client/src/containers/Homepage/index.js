/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import { Helmet } from 'react-helmet';

import SafeQuery from 'components/graphql/SafeQuery';
import { Hello } from 'graphql/queries';

/* eslint-disable react/prefer-stateless-function */
export default class HomePage extends React.PureComponent {
  render() {
    return (
      <main>
        <Helmet>
          <title>Home Page</title>
          <meta
            name="description"
            content="A React.js Boilerplate application homepage"
          />
        </Helmet>
        <SafeQuery query={Hello}>
          {({ data }) =>
            data ? (
              <div>
                <h1>{JSON.stringify(data)}</h1>
              </div>
            ) : (
              <div>No parties to show!</div>
            )
          }
        </SafeQuery>
      </main>
    );
  }
}
