/**
 *
 * FooterComponent
 *
 */

import React from 'react';
import { Container } from 'reactstrap';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  position: relative;
  bottom: 0;
  width: 100%;
  line-height: 34px;
  background-color: #20232a;
`;

const FooterLogo = styled.img`
  opacity: 0.4;
  transition: opacity 0.15s ease-in-out;

  &:hover {
    opacity: 1;
  }
`;

/* eslint-disable react/prefer-stateless-function */
export class FooterComponent extends React.PureComponent {
  render() {
    return (
      <FooterContainer className="text-light">
        <Container>
          <div className="mt-1 mb-1">
            <Link to="/" className="float-left">
              <FooterLogo
                className="mb-1"
                src="/images/logo.png"
                width="26"
                height="26"
                alt="app logo"
              />
            </Link>
            <span className="float-right">
              ® {new Date().getFullYear()} LEGAL_COMPANY_NAME.
            </span>
          </div>
        </Container>
      </FooterContainer>
    );
  }
}

FooterComponent.propTypes = {};

export default FooterComponent;
