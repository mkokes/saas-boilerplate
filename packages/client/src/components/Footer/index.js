/**
 *
 * FooterComponent
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  position: relative;
  bottom: 0;
  width: 100%;
  line-height: 34px;
  background-color: #f5f5f5;
`;

/* eslint-disable react/prefer-stateless-function */
export class FooterComponent extends React.PureComponent {
  render() {
    const { minimal } = this.props;

    return (
      <FooterContainer className="bg-dark text-light">
        <Container>
          <Row className="mx-auto pt-4" hidden={minimal}>
            <div className="col-6 col-md offset-md-1">
              <h5 className="font-weight-bold">Product</h5>
              <ul className="list-unstyled text-small">
                <li>
                  <Link to="/pricing" className="text-light">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="text-light">
                    Sign up
                  </Link>
                </li>
                <li>
                  <Link to="/auth/login" className="text-light">
                    Log in
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-6 col-md">
              <h5 className="font-weight-bold">Developers</h5>
              <ul className="list-unstyled text-small">
                <li>
                  <a
                    href="https://status.domain.io"
                    className="text-light"
                    target="new"
                  >
                    Status page
                  </a>
                </li>
                <li>
                  <a
                    href="https://docs.domain.io/api"
                    className="text-light"
                    target="new"
                  >
                    API documentation
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-6 col-md">
              <h5 className="font-weight-bold">Company</h5>
              <ul className="list-unstyled text-small">
                <li>
                  <Link to="/about" className="text-light">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-light">
                    Contact us
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-6 col-md">
              <h5 className="font-weight-bold">Resources</h5>
              <ul className="list-unstyled text-small">
                <li>
                  <Link to="/dashboard/support" className="text-light">
                    Support
                  </Link>
                </li>
                <li>
                  <a
                    href="https://blog.domain.io"
                    className="text-light"
                    target="new"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <Link to="/legal/terms" className="text-light">
                    Legal
                  </Link>
                </li>
              </ul>
            </div>
          </Row>
          <Row className="mt-1 mb-1">
            <Col xs="10">
              <span>® {new Date().getFullYear()} ACME Inc.</span>
            </Col>
            <Col xs="2" className="text-right">
              <img
                className=""
                src="/logo.png"
                alt="app logo"
                width="26"
                height="26"
              />
            </Col>
          </Row>
        </Container>
      </FooterContainer>
    );
  }
}

FooterComponent.propTypes = {
  minimal: PropTypes.bool,
};

export default FooterComponent;
