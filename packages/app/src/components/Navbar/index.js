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
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import MediaQuery from 'react-responsive';

import { GlobalConsumer } from 'GlobalState';
import Avatar from 'components/Avatar';
import HeadWay from 'components/HeadWay';

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
    const { pathname } = this.props.location;

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
          {({ userProfile }) => (
            <header>
              <MediaQuery minWidth={768}>
                {matchesMediaQuery => (
                  <Fragment>
                    <MainNavbar dark expand={expand} className="pt-0 pb-0">
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
                          style={{ maxHeight: 50 }}
                        >
                          <NavbarBrand tag="span">
                            <img src="/images/logo/34px.png" alt="logo" />
                            <span
                              style={{
                                fontSize: '20px',
                                fontWeight: '600',
                                verticalAlign: 'middle',
                              }}
                              className="ml-2"
                            >
                              PRODUCT_NAME
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
                                <span
                                  className="text-white ml-1 mr-1"
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
                                    {`${userProfile.firstName} ${
                                      userProfile.lastName
                                    }`}
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
                                          to="/dashboard/settings/profile"
                                          tag={RRNavLink}
                                        >
                                          Settings
                                        </DashboardDropdownItem>
                                      </Fragment>
                                    )}
                                    <DropdownItem divider />
                                    <DashboardDropdownItem
                                      to="/contact-support"
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
                      </Container>
                    </MainNavbar>
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
