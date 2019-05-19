/**
 *
 * Navbar
 *
 */

import React, { Fragment, useState } from 'react';
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
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

import { GlobalConsumer } from 'GlobalState';
import { useMediaMin } from 'mediaQuery';
import Avatar from 'components/Avatar';
import HeadWay from 'components/HeadWay';

import config from 'config';
const { PRODUCT_NAME } = config;

const MainNavbar = styled(Navbar)`
  background-color: ${props => props.theme.primaryColor};
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
  line-height: 42px;

  &.active {
    color: unset;
    text-decoration: none;
    background-color: transparent;
  }

  &.active:hover {
    background-color: #f8f9fa;
  }

  a {
    color: #212529 !important;
  }
`;
const DashboardNavbar = styled(Navbar)`
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: rgb(218, 225, 233);

  font-size: 18px;
  font-weight: 500;

  &&& .nav-link.active {
    color: ${props => props.theme.primaryColor};
  }
`;
const Backdrop = styled.div`
  position: fixed;
  top: 50px;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1040;
  background-color: rgba(26, 54, 80, 0.0980392);
  opacity: 1;
  cursor: pointer;
`;

function NavbarComponent(props) {
  const { location, brandNameLink, dashboardNavbarHidden } = props;

  const { pathname } = location;
  const isDashboardRoute = pathname.indexOf('/dashboard') === 0;

  const [isNavbarCollapseOpen, setIsNavbarCollapseOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isMinMedium = useMediaMin('medium');

  const renderDashboardNavItems = () => (
    <Fragment>
      <Nav navbar>
        <NavItem
          key="dashboard-navbar-home"
          onClick={() => setIsNavbarCollapseOpen(false)}
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
          onClick={() => setIsNavbarCollapseOpen(false)}
          className="mr-1"
        >
          <NavLink
            to="/dashboard/settings/profile"
            tag={RRNavLink}
            className={
              pathname.startsWith('/dashboard/settings') ? 'active' : ''
            }
          >
            <FontAwesomeIcon icon={faCog} className="align-text-top mr-1" />
            Settings
          </NavLink>
        </NavItem>
      </Nav>
      <Nav navbar>
        <NavItem
          key="give-feedback"
          onClick={() => setIsNavbarCollapseOpen(false)}
          className="mr-1"
        >
          <NavLink
            to="/dashboard/give-feedback"
            exact
            activeClassName="active"
            tag={RRNavLink}
          >
            Give Feedback
          </NavLink>
        </NavItem>
      </Nav>
    </Fragment>
  );

  return (
    <Fragment>
      <GlobalConsumer>
        {({ userProfile }) => (
          <header>
            <Fragment>
              <MainNavbar dark expand="md" className="pt-0 pb-0">
                <Container>
                  <NavbarToggler
                    key="navbar-toggler"
                    onClick={() => setIsNavbarCollapseOpen(status => !status)}
                    className="mr-1"
                    hidden={dashboardNavbarHidden && isMinMedium}
                  />

                  <NavLink
                    to={brandNameLink}
                    tag={RRNavLink}
                    className="p-0 m-0"
                    style={{
                      display: 'flex',
                      flex: 'auto',
                      maxHeight: 50,
                    }}
                    onClick={() => setIsNavbarCollapseOpen(false)}
                  >
                    <NavbarBrand
                      tag="span"
                      className="navbar-brandname float-left"
                    >
                      <img
                        src="/images/logo.png"
                        width="34"
                        height="34"
                        alt="logo"
                        className="d-none d-sm-inline"
                      />
                      <span
                        style={{
                          fontSize: '20px',
                          fontWeight: '600',
                          verticalAlign: 'middle',
                        }}
                        className="ml-2"
                      >
                        {PRODUCT_NAME}
                      </span>
                    </NavbarBrand>
                  </NavLink>
                  <Fragment>
                    <Nav navbar className="flex-row">
                      <HeadWay />
                      <Dropdown
                        isOpen={isDropdownOpen}
                        key="user-options"
                        nav
                        inNavbar
                        toggle={() => setIsDropdownOpen(status => !status)}
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
                          <span
                            className="text-white ml-1 mr-1 d-none d-sm-inline"
                            style={{
                              fontWeight: '400',
                            }}
                          >
                            {userProfile.nickname}
                          </span>
                        </DropdownToggle>
                        <DropdownMenu
                          style={{
                            minWidth: 260,
                            position: 'absolute',
                          }}
                          right
                          className="pb-0"
                        >
                          <UserBox>
                            <Avatar
                              src={`data:image/svg+xml;base64,${
                                userProfile.avatar
                              }`}
                            />
                            <span className="mb-1" style={{ fontSize: 18 }}>
                              {userProfile.firstName} {userProfile.lastName}
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
                                  <DropdownItem divider className="m-0" />
                                  <DashboardDropdownItem
                                    to="/dashboard/settings/profile"
                                    tag={RRNavLink}
                                  >
                                    Settings
                                  </DashboardDropdownItem>
                                </Fragment>
                              )}
                              <DropdownItem divider className="m-0" />
                              <DashboardDropdownItem
                                to="/support"
                                tag={RRNavLink}
                              >
                                Contact support
                              </DashboardDropdownItem>
                            </Fragment>
                          ) : (
                            <Fragment>
                              <DropdownItem divider className="m-0" />
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
                          <DropdownItem divider className="m-0" />
                          <DashboardDropdownItem to="/signout" tag={RRNavLink}>
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

                    {!dashboardNavbarHidden && isNavbarCollapseOpen && (
                      <Collapse
                        key="navbar-collapse"
                        isOpen={isNavbarCollapseOpen}
                        navbar
                      >
                        <Container>{renderDashboardNavItems()}</Container>
                      </Collapse>
                    )}
                  </Fragment>
                </Container>
              </MainNavbar>
              <DashboardNavbar
                light
                expand="xs"
                hidden={!isMinMedium || dashboardNavbarHidden}
              >
                <Container
                  style={{
                    paddingLeft: '15px',
                    paddingRight: '15px',
                  }}
                >
                  {renderDashboardNavItems()}
                </Container>
              </DashboardNavbar>
            </Fragment>
          </header>
        )}
      </GlobalConsumer>
    </Fragment>
  );
}

NavbarComponent.propTypes = {
  brandNameLink: PropTypes.string,
  location: PropTypes.object,
  dashboardNavbarHidden: PropTypes.bool,
};
NavbarComponent.defaultProps = {
  brandNameLink: '/',
  dashboardNavbarHidden: true,
};

export default withRouter(NavbarComponent);
