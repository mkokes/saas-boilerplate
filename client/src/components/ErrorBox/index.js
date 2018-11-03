import React from 'react';
import styled from 'styled-components';

const ErrorDiv = styled.div`
  width: 100%;
  background: #f00;
  color: #fff;
  padding: 1em 2em;
  justify-content: space-between;
`;

const ErrorBox = children => <ErrorDiv>{children}</ErrorDiv>;

export default ErrorBox;
