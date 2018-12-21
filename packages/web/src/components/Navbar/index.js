/**
 *
 * Navbar
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { NavLink as RRNavLink } from 'react-router-dom';
import { withRouter } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUnlockAlt, faHome, faCog } from '@fortawesome/free-solid-svg-icons';
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
import MediaQuery from 'react-responsive';

import { GlobalConsumer } from 'GlobalState';
import Avatar from 'components/Avatar';
import HeadWay from 'components/HeadWay';

const NavbarNotLoggedNav = styled(Nav)`
  &&& .nav-link > button {
    display: block;
    width: 100%;
  }

  @media (min-width: 576px) {
    align-items: center;
  }
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
    color: unset;
    text-decoration: none;
    background-color: transparent;
  }

  &.active:hover {
    background-color: #f8f9fa;
  }
`;
const DashboardNavbar = styled(Navbar)`
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: rgb(218, 225, 233);

  font-size: 18px;
  font-weight: 500;

  &&& .nav-link.active {
    color: rgb(6, 103, 208);
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

  renderDashboardNavItems() {
    return (
      <Fragment>
        <Nav navbar>
          <NavItem
            key="dashboard-navbar-home"
            onClick={this.handleClick}
            className="mr-1"
          >
            <NavLink
              to="/dashboard"
              exact
              activeClassName="active"
              tag={RRNavLink}
            >
              <FontAwesomeIcon icon={faHome} className="align-text-top mr-1" />
              Dashboard
            </NavLink>
          </NavItem>
          <NavItem key="dashboard" onClick={this.handleClick} className="mr-1">
            <NavLink
              to="/dashboard/settings"
              exact
              activeClassName="active"
              tag={RRNavLink}
            >
              <FontAwesomeIcon icon={faCog} className="align-text-top mr-1" />
              Settings
            </NavLink>
          </NavItem>
        </Nav>
      </Fragment>
    );
  }

  render() {
    const {
      location,
      expand,
      brandNameLink,
      dashboardNavbarHidden,
    } = this.props;
    const { isOpen } = this.state;

    const { pathname } = location;
    const isDashboardRoute = pathname.indexOf('/dashboard') === 0;

    return (
      <Fragment>
        <GlobalConsumer>
          {({ loggedIn, userProfile }) => (
            <header>
              <MediaQuery minWidth={768}>
                {matchesMediaQuery => (
                  <Fragment>
                    <Navbar color="dark" dark expand={expand}>
                      <Container>
                        {!dashboardNavbarHidden && (
                          <>
                            {!matchesMediaQuery && (
                              <NavbarToggler
                                key="navbar-toggler"
                                onClick={this.toggle}
                                className="mr-1"
                              />
                            )}
                          </>
                        )}

                        <NavLink
                          to={brandNameLink}
                          tag={RRNavLink}
                          className="mr-auto navbar-brand navbar-brandname pl-2"
                          onClick={this.handleClick}
                        >
                          <NavbarBrand tag="span">
                            Domain.io
                            <span className="beta-icon align-text-bottom">
                              beta
                            </span>
                          </NavbarBrand>
                        </NavLink>
                        {!loggedIn ? (
                          <Fragment>
                            <NavbarToggler
                              key="navbar-toggler"
                              onClick={this.toggle}
                            />
                            <Collapse
                              key="navbar-collapse"
                              isOpen={isOpen}
                              navbar
                            >
                              <NavbarNotLoggedNav className="ml-auto" navbar>
                                <NavItem key="login" onClick={this.handleClick}>
                                  <NavLink
                                    to="/auth/login"
                                    exact
                                    activeClassName="active"
                                    tag={RRNavLink}
                                  >
                                    <Button
                                      color="link"
                                      style={{
                                        color: '#f8f9fa',
                                        textDecoration: 'none',
                                      }}
                                    >
                                      Sign In
                                    </Button>
                                  </NavLink>
                                </NavItem>
                                <NavItem
                                  key="register"
                                  onClick={this.handleClick}
                                >
                                  <NavLink
                                    to="/signup"
                                    exact
                                    activeClassName="active"
                                    tag={RRNavLink}
                                  >
                                    <Button color="primary">
                                      <strong>Get Started</strong>
                                    </Button>
                                  </NavLink>
                                </NavItem>
                              </NavbarNotLoggedNav>
                            </Collapse>
                          </Fragment>
                        ) : (
                          <Fragment>
                            <Nav navbar className="flex-row">
                              <HeadWay />
                              <UncontrolledDropdown
                                key="user-options"
                                nav
                                inNavbar
                              >
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
                                  style={{
                                    minWidth: 260,
                                    position: 'absolute',
                                  }}
                                  right
                                >
                                  <UserBox>
                                    <Avatar
                                      src={`data:image/svg+xml;base64,${
                                        userProfile.avatar
                                      }`}
                                    />
                                    <span
                                      className="mb-1"
                                      style={{ fontSize: 18 }}
                                    >
                                      {userProfile.fullName}
                                    </span>
                                    <span
                                      className="text-muted"
                                      style={{ fontSize: 14 }}
                                    >
                                      {userProfile.email}
                                    </span>
                                  </UserBox>

                                  {isDashboardRoute ? (
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
                                  <DashboardDropdownItem
                                    to="/signout"
                                    tag={RRNavLink}
                                  >
                                    {isDashboardRoute && (
                                      <FontAwesomeIcon
                                        icon={faUnlockAlt}
                                        className="align-text-top mr-1"
                                      />
                                    )}
                                    Sign out
                                  </DashboardDropdownItem>
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            </Nav>

                            {!dashboardNavbarHidden && (
                              <>
                                {!matchesMediaQuery && (
                                  <Collapse
                                    key="navbar-collapse"
                                    isOpen={isOpen}
                                    navbar
                                  >
                                    <Container>
                                      {this.renderDashboardNavItems()}
                                    </Container>
                                  </Collapse>
                                )}
                              </>
                            )}
                          </Fragment>
                        )}
                      </Container>
                    </Navbar>
                    {!dashboardNavbarHidden && (
                      <>
                        {matchesMediaQuery && (
                          <DashboardNavbar light expand="xs">
                            <Container
                              style={{
                                paddingLeft: '15px',
                                paddingRight: '15px',
                              }}
                            >
                              {this.renderDashboardNavItems()}
                            </Container>
                          </DashboardNavbar>
                        )}
                      </>
                    )}
                  </Fragment>
                )}
              </MediaQuery>
            </header>
          )}
        </GlobalConsumer>
      </Fragment>
    );
  }
}

NavbarComponent.propTypes = {
  expand: PropTypes.string,
  brandNameLink: PropTypes.string,
  location: PropTypes.object,
  dashboardNavbarHidden: PropTypes.bool,
};
NavbarComponent.defaultProps = {
  expand: 'sm',
  brandNameLink: '/',
  dashboardNavbarHidden: true,
};

export default withRouter(NavbarComponent);
