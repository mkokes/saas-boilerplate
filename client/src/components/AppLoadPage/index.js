/**
 *
 * AppLoadPage
 *
 */

import React, { useState, useEffect } from 'react';
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
function AppLoadPage() {
  const [display, setDisplay] = useState('none');

  useEffect(() => {
    const timer = setTimeout(() => setDisplay('block'), 800); // show app load indicator only if it takes >800ms

    return function cleanup() {
      clearTimeout(timer);
    };
  });

  return (
    <Container style={{ display }}>
      <LoadingIconContainer>
        <ClipLoader sizeUnit="em" size={7} />
      </LoadingIconContainer>
      <LoadingText>Loading</LoadingText>
    </Container>
  );
}

export default AppLoadPage;
