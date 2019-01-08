/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
`;
const HeaderTitle = styled.h1`
  color: ${props => props.theme.primaryColor};
  font-size: 8.8em;
  font-weight: 700;
`;
const SubHeaderTitle = styled.p`
  font-size: 1.6em;
`;

/* eslint-disable react/prefer-stateless-function */
export default class NotFound extends React.PureComponent {
  render() {
    return (
      <Fragment>
        <Helmet>
          <title>Not found page</title>
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <Container>
          <HeaderTitle className="pb-4">404</HeaderTitle>
          <SubHeaderTitle>Page Not Found.</SubHeaderTitle>
          <Link to="/">
            <Button
              size="lg"
              className="btn-theme mt-4"
              style={{ fontSize: '30px' }}
            >
              <strong>Return to the dashboard</strong>
            </Button>
          </Link>
        </Container>
      </Fragment>
    );
  }
}
