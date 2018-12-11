/**
 *
 * MainPage
 *
 */

import React, { Fragment } from 'react';
// import PropTypes from 'prop-types';
import { Container, Card, Button, CardTitle, CardText } from 'reactstrap';
import { Helmet } from 'react-helmet';

import { GlobalConsumer } from 'GlobalState';

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
          {/* <Card
                body
                inverse
                style={{ backgroundColor: '#333', borderColor: '#333' }}
              >
                <CardTitle>Special Title Treatment</CardTitle>
                <CardText>
                  With supporting text below as a natural lead-in to additional
                  content.
                </CardText>
                <Button>Button</Button>
              </Card> */}
        </Container>
      </Fragment>
    );
  }
}

MainPage.propTypes = {};
