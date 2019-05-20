/**
 *
 * ProcessingPage
 *
 */

import React, { Fragment } from 'react';
// import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import Loader from 'components/Loader';

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

/* eslint-disable react/prefer-stateless-function */
export default class ProcessingPage extends React.PureComponent {
  render() {
    return (
      <Fragment>
        <Helmet>
          <title>Processing...</title>
          <meta name="robots" content="noindex, follow" />
        </Helmet>

        <Container>
          <Loader large noDelay />
          <h1 className="mt-4">We are processing your request...</h1>
        </Container>
      </Fragment>
    );
  }
}

ProcessingPage.propTypes = {};
