// @TODO: Refactor this component

/**
 *
 * Navbar
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Collapse,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
  Button,
} from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';

/* eslint-disable react/prefer-stateless-function */
export class NavbarComponent extends React.PureComponent {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      isOpen: false,
    };
  }

  toggle() {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  }

  handleClick() {
    const { isOpen } = this.state;

    if (isOpen) this.toggle();
  }

  render() {
    const { navbarBrandLink } = this.props;
    const { isOpen } = this.state;

    return (
      <header>
        <Navbar color="dark" dark expand="sm">
          <Container>
            <NavLink
              to={navbarBrandLink}
              tag={RRNavLink}
              className="navbar-brand navbar-brandname"
              onClick={this.handleClick}
            >
              <NavbarBrand tag="span">
                Domain.io
                <span className="beta-icon align-text-bottom">beta</span>
              </NavbarBrand>
            </NavLink>
            <NavbarToggler key="navbar-toggler" onClick={this.toggle} />
            <Collapse key="navbar-collapse" isOpen={isOpen} navbar>
              <Nav className="ml-auto align-items-center" navbar>
                <NavItem key="register" onClick={this.handleClick}>
                  <NavLink
                    to="/signup"
                    exact
                    activeClassName="active"
                    tag={RRNavLink}
                  >
                    <Button color="primary">
                      <strong>Sign up</strong>
                    </Button>
                  </NavLink>
                </NavItem>
                <NavItem key="login" onClick={this.handleClick}>
                  <NavLink
                    to="/auth/login"
                    exact
                    activeClassName="active"
                    className="text-light"
                    tag={RRNavLink}
                  >
                    Log In
                  </NavLink>
                </NavItem>
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
      </header>
    );
  }
}

NavbarComponent.defaultProps = {
  navbarBrandLink: '/',
};
NavbarComponent.propTypes = {
  navbarBrandLink: PropTypes.string,
};

export default NavbarComponent;
