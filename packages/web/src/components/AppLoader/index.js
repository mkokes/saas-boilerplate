/**
 *
 * AppLoader
 *
 */

import React from 'react';
import styled from 'styled-components';
import ClipLoader from 'react-spinners/ClipLoader';

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
function AppLoader() {
  return (
    <Container>
      <LoadingIconContainer>
        <ClipLoader sizeUnit="em" size={7} />
      </LoadingIconContainer>
      <span>
        <LoadingText>Loading</LoadingText>
      </span>
    </Container>
  );
}

export default AppLoader;
