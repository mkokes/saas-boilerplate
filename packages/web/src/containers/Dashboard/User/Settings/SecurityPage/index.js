/**
 *
 * SecurityPage
 *
 */

import React, { Fragment } from 'react';
import { Row, Col, Card, Button } from 'reactstrap';
import { Helmet } from 'react-helmet';

import { GlobalConsumer } from 'GlobalState';

/* eslint-disable react/prefer-stateless-function */
export default class SecurityPage extends React.PureComponent {
  render() {
    return (
      <Fragment>
        <Helmet>
          <title>SecurityPage</title>
          <meta name="description" content="Description of SecurityPage" />
        </Helmet>
        <GlobalConsumer>
          {({ userProfile }) => (
            <Fragment>
              <h1 className="mb-3">Account Security</h1>
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

SecurityPage.propTypes = {};
