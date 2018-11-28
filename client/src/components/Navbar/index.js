// @TODO: Refactor this component

/**
 *
 * Navbar
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { NavLink as RRNavLink } from 'react-router-dom';
import { withRouter } from 'react-router';

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
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCog,
  faUnlockAlt,
  faHome,
  faUserAlt,
  faLifeRing,
} from '@fortawesome/free-solid-svg-icons';

import { GlobalConsumer } from 'GlobalState';

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
    const { location, history, navbarBrandLink } = this.props;
    const { isOpen } = this.state;

    const { pathname } = location;

    return (
      <GlobalConsumer>
        {({ loggedIn, logOut, userProfile }) => (
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
                {!loggedIn ? (
                  <Fragment>
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
                  </Fragment>
                ) : (
                  <Nav className="ml-auto align-items-center" navbar>
                    <UncontrolledDropdown key="user-options" nav>
                      <DropdownToggle nav caret>
                        <FontAwesomeIcon
                          icon={faUserAlt}
                          className="fa-lg navbar-user-icon"
                        />

                        <span className="navbar-user-username">
                          {userProfile.name}
                        </span>
                      </DropdownToggle>
                      <DropdownMenu right>
                        {pathname.indexOf('/dashboard') === 0 ? (
                          <Fragment>
                            {userProfile.isEmailConfirmed && (
                              <DropdownItem
                                onClick={() =>
                                  history.push('/dashboard/user/settings')
                                }
                              >
                                <FontAwesomeIcon
                                  icon={faCog}
                                  className="align-text-top mr-1"
                                />
                                Settings
                              </DropdownItem>
                            )}
                            <DropdownItem
                              onClick={() => history.push('/support')}
                            >
                              <FontAwesomeIcon
                                icon={faLifeRing}
                                className="align-text-top mr-1"
                              />
                              Contact support
                            </DropdownItem>
                          </Fragment>
                        ) : (
                          <DropdownItem
                            onClick={() => history.push('/dashboard/index')}
                          >
                            <FontAwesomeIcon
                              icon={faHome}
                              className="align-text-top mr-1"
                            />
                            Go to Dashboard
                          </DropdownItem>
                        )}

                        <DropdownItem onClick={() => logOut()}>
                          <FontAwesomeIcon
                            icon={faUnlockAlt}
                            className="align-text-top mr-1"
                          />
                          Sign out
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </Nav>
                )}
              </Container>
            </Navbar>
          </header>
        )}
      </GlobalConsumer>
    );
  }
}

NavbarComponent.propTypes = {
  navbarBrandLink: PropTypes.string,
  location: PropTypes.object,
  history: PropTypes.object,
};
NavbarComponent.defaultProps = {
  navbarBrandLink: '/',
};

export default withRouter(NavbarComponent);
