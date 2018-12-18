/**
 *
 * Navbar
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { NavLink as RRNavLink } from 'react-router-dom';
import { withRouter } from 'react-router';
import styled from 'styled-components';
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
import { faUnlockAlt, faHome } from '@fortawesome/free-solid-svg-icons';

import { GlobalConsumer } from 'GlobalState';
import Avatar from 'components/Avatar';
import HeadWay from 'components/HeadWay';

const DashboardNav = styled(Nav)`
  flex-direction: row;
`;
const UserBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px 50px;

  img {
    width: 60px;
    height: 60px;
  }
`;
const DashboardDropdownItem = styled(DropdownItem)`
  padding-left: 16px;
  padding-right: 16px;

  &.active {
    color: #16181b;
    text-decoration: none;
    background-color: transparent;
  }

  &.active:hover {
    background-color: #f8f9fa;
  }
`;

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
    const { location, brandNameLink } = this.props;
    const { isOpen } = this.state;

    const { pathname } = location;

    return (
      <GlobalConsumer>
        {({ loggedIn, userProfile }) => (
          <header>
            <Navbar color="dark" dark expand="sm">
              <Container>
                <NavLink
                  to={brandNameLink}
                  tag={RRNavLink}
                  className="navbar-brand navbar-brandname p-0"
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
                  <DashboardNav className="ml-auto align-items-center" navbar>
                    <HeadWay />
                    <UncontrolledDropdown key="user-options" nav inNavbar>
                      <DropdownToggle nav caret>
                        <Avatar
                          width="32"
                          height="32"
                          src={`data:image/svg+xml;base64,${
                            userProfile.avatar
                          }`}
                        />
                        <span className="text-white ml-1 mr-1">
                          {userProfile.nickname}
                        </span>
                      </DropdownToggle>
                      <DropdownMenu
                        style={{ minWidth: 260, position: 'absolute' }}
                        right
                      >
                        <UserBox>
                          <Avatar
                            src={`data:image/svg+xml;base64,${
                              userProfile.avatar
                            }`}
                          />
                          <span className="mb-1" style={{ fontSize: 18 }}>
                            {userProfile.fullName}
                          </span>
                          <span className="text-muted" style={{ fontSize: 14 }}>
                            {userProfile.email}
                          </span>
                        </UserBox>

                        {pathname.indexOf('/dashboard') === 0 ? (
                          <Fragment>
                            {userProfile.isSignUpEmailConfirmed && (
                              <Fragment>
                                <DropdownItem divider />
                                <DashboardDropdownItem
                                  to="/dashboard/settings"
                                  tag={RRNavLink}
                                >
                                  Settings
                                </DashboardDropdownItem>
                              </Fragment>
                            )}
                            <DropdownItem divider />
                            <DashboardDropdownItem
                              to="/support"
                              tag={RRNavLink}
                            >
                              Contact support
                            </DashboardDropdownItem>
                          </Fragment>
                        ) : (
                          <Fragment>
                            <DropdownItem divider />
                            <DashboardDropdownItem
                              to="/dashboard"
                              tag={RRNavLink}
                            >
                              <FontAwesomeIcon
                                icon={faHome}
                                className="align-text-top mr-1"
                              />
                              Dashboard
                            </DashboardDropdownItem>
                          </Fragment>
                        )}
                        <DropdownItem divider />
                        <DashboardDropdownItem to="/signout" tag={RRNavLink}>
                          {pathname.indexOf('/dashboard') !== 0 && (
                            <FontAwesomeIcon
                              icon={faUnlockAlt}
                              className="align-text-top mr-1"
                            />
                          )}
                          Sign out
                        </DashboardDropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </DashboardNav>
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
  brandNameLink: PropTypes.string,
  location: PropTypes.object,
};
NavbarComponent.defaultProps = {
  brandNameLink: '/',
};

export default withRouter(NavbarComponent);
