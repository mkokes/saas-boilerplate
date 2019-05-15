/**
 *
 * SplashScreen
 *
 */

import React from 'react';
import styled from 'styled-components';

import { BaseLayout } from 'layout';
import Loader from 'components/Loader';

import Delayed from 'components/Delayed';

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
function SplashScreen() {
  return (
    <Delayed wait={450}>
      <BaseLayout>
        <Container>
          <Loader large />
          <h1 className="mt-4">Loading Application</h1>
        </Container>
      </BaseLayout>
    </Delayed>
  );
}

export default SplashScreen;
