/**
 *
 * DashboardSettingsWrapper
 *
 */

import React from 'react';
import { NavLink as RRNavLink } from 'react-router-dom';
import { withRouter } from 'react-router';
import {
  Nav,
  Container,
  NavItem,
  NavLink as RSNavLink,
  Card,
  CardBody,
} from 'reactstrap';
import PropTypes from 'prop-types';
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
    color: #444;
  }
`;

/* eslint-disable react/prefer-stateless-function */
class DashboardSettingsWrapper extends React.PureComponent {
  render() {
    const { children } = this.props;

    return (
      <Container tag="main" className="flex flex-column pt-4 pb-5">
        <Card>
          <Navbar className="d-flex flex-row" style={{ height: 63 }}>
            <Container>
              <Nav className="flex align-items-center" style={{ height: 63 }}>
                <NavItem>
                  <NavLink
                    to="/dashboard/settings"
                    exact
                    activeClassName="active"
                    tag={RRNavLink}
                  >
                    My Profile
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    to="/dashboard/settings/preferences"
                    exact
                    activeClassName="active"
                    tag={RRNavLink}
                  >
                    Preferences
                  </NavLink>
                </NavItem>
              </Nav>
            </Container>
          </Navbar>
          <CardBody>{children}</CardBody>
        </Card>
      </Container>
    );
  }
}

DashboardSettingsWrapper.propTypes = {
  children: PropTypes.node,
};

export default withRouter(DashboardSettingsWrapper);
