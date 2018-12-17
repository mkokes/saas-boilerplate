/**
 *
 * PreferencesPage
 *
 */

import React, { Fragment } from 'react';
import { Row, Col, Card, Button } from 'reactstrap';
import { Helmet } from 'react-helmet';

import { GlobalConsumer } from 'GlobalState';

/* eslint-disable react/prefer-stateless-function */
export default class PreferencesPage extends React.PureComponent {
  render() {
    return (
      <Fragment>
        <Helmet>
          <title>PreferencesPage</title>
          <meta name="description" content="Description of PreferencesPage" />
        </Helmet>
        <GlobalConsumer>
          {({ userProfile }) => (
            <Fragment>
              <h1 className="mb-3">Preferences</h1>
              <Card body>
                <p>Content</p>
              </Card>
            </Fragment>
          )}
        </GlobalConsumer>
      </Fragment>
    );
  }
}

PreferencesPage.propTypes = {};
