/**
 *
 * Navbar
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Container, Menu, Button } from 'semantic-ui-react';

const BrandNameMenuItem = styled(Menu.Item)`
  a {
    color: rgba(0, 0, 0, 0.87);
  }
`;
const SignUpButton = styled(Button)`
  &&& {
    font-size: 1em;
  }
`;

/* eslint-disable react/prefer-stateless-function */
class Navbar extends React.PureComponent {
  render() {
    const { brandNameLink } = this.props;

    return (
      <header>
        <Menu size="huge" borderless>
          <Container>
            <BrandNameMenuItem header>
              <Link to={brandNameLink}>APP_BRAND_NAME</Link>
            </BrandNameMenuItem>
            <Menu.Item position="right">
              <Menu.Item>
                <Link to="/auth/login">Log in</Link>
              </Menu.Item>
              <Menu.Item name="signup">
                <Link to="/signup" className="button">
                  <SignUpButton basic>Sign up</SignUpButton>
                </Link>
              </Menu.Item>
            </Menu.Item>
          </Container>
        </Menu>
      </header>
    );
  }
}

Navbar.defaultProps = {
  brandNameLink: '/',
};
Navbar.propTypes = {
  brandNameLink: PropTypes.string,
};

export default Navbar;
