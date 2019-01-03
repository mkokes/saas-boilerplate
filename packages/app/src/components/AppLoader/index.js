/**
 *
 * AppLoader
 *
 */

import React from 'react';
import styled from 'styled-components';
import ClipLoader from 'react-spinners/ClipLoader';

import { BaseLayout } from 'layout';

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

/* eslint-disable react/prefer-stateless-function */
function AppLoader() {
  return (
    <BaseLayout>
      <Container>
        <LoadingIconContainer>
          <ClipLoader sizeUnit="em" size={7} />
        </LoadingIconContainer>
        <h1 className="mt-4">Loading Application</h1>
      </Container>
    </BaseLayout>
  );
}

export default AppLoader;
