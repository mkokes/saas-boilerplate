/**
 *
 * MainPage
 *
 */

import React, { Fragment } from 'react';
import { Container, Button } from 'reactstrap';
import { Helmet } from 'react-helmet';
import { ApolloConsumer } from 'react-apollo';

import { UserProfileQuery, isUserEmailConfirmedQuery } from 'graphql/queries';

/* eslint-disable react/prefer-stateless-function */
export default class MainPage extends React.PureComponent {
  render() {
    return (
      <Fragment>
        <Helmet>
          <title>Dashboard index</title>
          <meta
            name="description"
            content="Description of User dashboard main page"
          />
        </Helmet>
        <Container tag="main">
          <ApolloConsumer>
            {client => (
              <Button
                size="lg"
                onClick={async () => {
                  console.debug('Fire!');
                  client.query({
                    query: UserProfileQuery,
                    fetchPolicy: 'network-only',
                  });
                  client.query({
                    query: isUserEmailConfirmedQuery,
                    fetchPolicy: 'network-only',
                  });
                }}
              >
                Fire HTTP requests
              </Button>
            )}
          </ApolloConsumer>
        </Container>
      </Fragment>
    );
  }
}

MainPage.propTypes = {};
