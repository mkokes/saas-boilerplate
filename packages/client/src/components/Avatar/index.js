/**
 *
 * Avatar
 *
 */

import React from 'react';
import styled from 'styled-components';

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #fff;
`;

function AvatarComponent(props) {
  return <Avatar width="128" height="128" {...props} />;
}

export default AvatarComponent;
