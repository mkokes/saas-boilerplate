import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Delayed from 'components/Delayed';

const LoaderContainer = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Circle = styled.circle`
  stroke: ${props => props.theme.color3};
`;

const Loader = ({ large, noDelay }) => (
  <Delayed wait={100} noDelay={noDelay}>
    <LoaderContainer>
      <svg
        width={large ? '80' : '40'}
        height={large ? '80' : '40'}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
        className="lds-rolling"
      >
        <Circle
          cx="50"
          cy="50"
          fill="none"
          strokeWidth="20"
          r="35"
          strokeDasharray="164.93361431346415 56.97787143782138"
          transform="rotate(83.939 50 50)"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            calcMode="linear"
            values="0 50 50;360 50 50"
            keyTimes="0;1"
            dur="1s"
            begin="0s"
            repeatCount="indefinite"
          />
        </Circle>
      </svg>
    </LoaderContainer>
  </Delayed>
);

Loader.propTypes = {
  large: PropTypes.bool,
  noDelay: PropTypes.bool,
};

export default Loader;
