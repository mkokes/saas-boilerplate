/**
 *
 * AppLoadPage
 *
 */

import React from 'react';
import styled from 'styled-components';

import ClipLoader from 'react-spinners/ClipLoader';

const Container = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
`;
const LoadingIconContainer = styled.div`
  div {
    border-color: rgb(54, 215, 183);
    border-bottom-color: transparent;
    display: block;
    margin: 0 auto;
  }
`;
const LoadingText = styled.h1`
  padding-top: 20px;
  display: block;
`;

/* eslint-disable react/prefer-stateless-function */
class AppLoadPage extends React.PureComponent {
  render() {
    return (
      <Container>
        <LoadingIconContainer>
          <ClipLoader sizeUnit="em" size={7} />
        </LoadingIconContainer>
        <LoadingText>Loading App ...</LoadingText>
      </Container>
    );
  }
}

export default AppLoadPage;
