/**
 *
 * DashboardNavbar
 *
 */

import React from 'react';
import { NavLink as RRNavLink } from 'react-router-dom';
import { withRouter } from 'react-router';
import { Nav, Container, NavItem, NavLink as RSNavLink } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faAlignCenter } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

const Navbar = styled.div`
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: rgb(218, 225, 233);
`;
const NavLink = styled(RSNavLink)`
  font-weight: 500;
  color: rgb(125, 149, 182);

  &.active {
    color: rgb(6, 103, 208);
    border-bottom: 1px solid #0067c8;
  }
  &.active:hover {
    color: rgb(6, 103, 208);
    border-bottom: 1px solid #0067c8;
  }

  &:hover {
    color: rgb(125, 149, 182);
  }
`;

/* eslint-disable react/prefer-stateless-function */
class DashboardNavbar extends React.PureComponent {
  render() {
    return (
      <Navbar className="d-flex flex-row">
        <Container>
          <Nav className="flex align-items-center" style={{ height: 63 }}>
            <NavItem>
              <NavLink
                to="/dashboard/index"
                exact
                activeClassName="active"
                tag={RRNavLink}
              >
                <FontAwesomeIcon icon={faAlignCenter} className="mr-2" />
                Dashboard
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                to="/dashboard/settings"
                activeClassName="active"
                tag={RRNavLink}
              >
                <FontAwesomeIcon icon={faCog} className="mr-2" />
                Settings
              </NavLink>
            </NavItem>
          </Nav>
        </Container>
      </Navbar>
    );
  }
}

export default withRouter(DashboardNavbar);
