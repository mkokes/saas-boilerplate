/**
 *
 * Avatar
 *
 */

import React from 'react';
import styled from 'styled-components';

const Avatar = styled.img`
  border-radius: 50%;
  background-color: #fff;
`;

function AvatarComponent(props) {
  return <Avatar {...props} />;
}

export default AvatarComponent;
