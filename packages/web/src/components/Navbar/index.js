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
  Dropdown,
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
const Backdrop = styled.div`
  position: fixed;
  top: 65px;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1040;
  background-color: rgba(26, 54, 80, 0.0980392);
  opacity: 1;
`;

/* eslint-disable react/prefer-stateless-function */
export class NavbarComponent extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isNavbarCollapseOpen: false,
      isDropdownOpen: false,
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle(item) {
    this.setState(prevState => ({
      [item]: !prevState[item],
    }));
  }

  renderDashboardNavItems() {
    return (
      <Fragment>
        <Nav navbar>
          <NavItem
            key="dashboard-navbar-home"
            onClick={() => this.setState({ isNavbarCollapseOpen: false })}
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
          <NavItem
            key="dashboard"
            onClick={() => this.setState({ isNavbarCollapseOpen: false })}
            className="mr-1"
          >
            <NavLink
              to="/dashboard/settings"
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
    const { isNavbarCollapseOpen, isDropdownOpen } = this.state;

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
                                onClick={() =>
                                  this.toggle('isNavbarCollapseOpen')
                                }
                                className="mr-1"
                              />
                            )}
                          </>
                        )}

                        <NavLink
                          to={brandNameLink}
                          tag={RRNavLink}
                          className="mr-auto navbar-brand navbar-brandname pl-2"
                          onClick={() =>
                            this.setState({ isNavbarCollapseOpen: false })
                          }
                          style={{ zIndex: '1050' }}
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
                              onClick={() =>
                                this.toggle('isNavbarCollapseOpen')
                              }
                            />
                            <Collapse
                              key="navbar-collapse"
                              isOpen={isNavbarCollapseOpen}
                              navbar
                            >
                              <NavbarNotLoggedNav className="ml-auto" navbar>
                                <NavItem
                                  key="login"
                                  onClick={() =>
                                    this.setState({
                                      isNavbarCollapseOpen: false,
                                    })
                                  }
                                >
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
                                  onClick={() =>
                                    this.setState({
                                      isNavbarCollapseOpen: false,
                                    })
                                  }
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
                              <HeadWay style={{ zIndex: '1050' }} />
                              <Dropdown
                                isOpen={isDropdownOpen}
                                key="user-options"
                                nav
                                inNavbar
                                toggle={() => this.toggle('isDropdownOpen')}
                                style={{ zIndex: '1050' }}
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
                              </Dropdown>
                              <Backdrop hidden={!isDropdownOpen} />
                            </Nav>

                            {!dashboardNavbarHidden && (
                              <>
                                {!matchesMediaQuery && (
                                  <Collapse
                                    key="navbar-collapse"
                                    isOpen={isNavbarCollapseOpen}
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
