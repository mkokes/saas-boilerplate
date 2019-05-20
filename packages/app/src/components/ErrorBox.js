import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Alert } from 'reactstrap';

const Error = styled(Alert)`
  width: 100%;
  padding: 1em 2em;
  justify-content: space-between;
`;

const ErrorBox = props => (
  <Error color="danger" fade={false} {...props}>
    <strong>{props.children}</strong>
  </Error>
);

ErrorBox.propTypes = {
  children: PropTypes.node,
};

export default ErrorBox;
