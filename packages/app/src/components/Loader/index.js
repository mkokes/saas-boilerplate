import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withTheme } from 'styled-components';

const LoaderContainer = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Loader = ({ large, theme }) => (
  <LoaderContainer>
    <svg
      width={large ? '80' : '40'}
      height={large ? '80' : '40'}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
      className="lds-rolling"
    >
      <circle
        cx="50"
        cy="50"
        fill="none"
        stroke={theme.color3}
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
      </circle>
    </svg>
  </LoaderContainer>
);

Loader.propTypes = {
  large: PropTypes.bool,
  theme: PropTypes.object,
};

export default withTheme(Loader);
