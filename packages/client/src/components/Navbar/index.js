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
  UncontrolledTooltip,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUnlockAlt, faHome, faBell } from '@fortawesome/free-solid-svg-icons';

import { GlobalConsumer } from 'GlobalState';
import Avatar from 'components/Avatar';

const DashboardNav = styled(Nav)`
  flex-direction: row;
`;
const ChangelogNavItem = styled(NavItem)`
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
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

  componentDidMount() {
    window.Headway.init({
      selector: '.headway',
      trigger: '.headway-trigger',
      account: 'xaEvgx',
    });
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
                    <ChangelogNavItem
                      className="headway-trigger mr-3"
                      id="UncontrolledTooltipExample"
                    >
                      <UncontrolledTooltip
                        placement="bottom"
                        target="UncontrolledTooltipExample"
                      >
                        Product updates
                      </UncontrolledTooltip>

                      <FontAwesomeIcon icon={faBell} color="gray" size="lg" />
                      <div className="headway" />
                    </ChangelogNavItem>
                    <UncontrolledDropdown key="user-options" nav inNavbar>
                      <DropdownToggle nav caret>
                        <Avatar
                          src={`data:image/svg+xml;base64,${
                            userProfile.avatar
                          }`}
                        />
                        <span className="text-white ml-1 mr-1">
                          {userProfile.username}
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
                            {userProfile.isEmailConfirmed && (
                              <Fragment>
                                <DropdownItem divider />
                                <DashboardDropdownItem
                                  onClick={() =>
                                    history.push('/dashboard/user/settings')
                                  }
                                >
                                  Settings
                                </DashboardDropdownItem>
                              </Fragment>
                            )}
                            <DropdownItem divider />
                            <DashboardDropdownItem
                              onClick={() => history.push('/support')}
                            >
                              Contact support
                            </DashboardDropdownItem>
                          </Fragment>
                        ) : (
                          <Fragment>
                            <DropdownItem divider />
                            <DashboardDropdownItem
                              onClick={() => history.push('/dashboard/index')}
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
                        <DashboardDropdownItem onClick={() => logOut()}>
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
  navbarBrandLink: PropTypes.string,
  location: PropTypes.object,
  history: PropTypes.object,
};
NavbarComponent.defaultProps = {
  navbarBrandLink: '/',
};

export default withRouter(NavbarComponent);
