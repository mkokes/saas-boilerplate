/**
 *
 * DashboardSettingsNavbar
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { NavLink as RRNavLink } from 'react-router-dom';
import { withRouter } from 'react-router';
import { Container, Col, Row, Nav, NavItem, NavLink } from 'reactstrap';
import styled from 'styled-components';

const SideNav = styled.div`
  .nav-item {
    padding: 0.2rem 0 0.2rem 0;
  }

  .nav-link {
    color: rgba(0, 0, 0, 0.5);
    padding: 0.3rem 0.5rem 0.3rem 1rem;
    border-left: 2px solid transparent;
  }

  .nav-link:hover {
    color: rgba(0, 0, 0, 0.7);
  }

  .nav-link.active {
    color: ${props => props.theme.secondaryColor};
    border-left: 2px solid ${props => props.theme.primaryColor};
  }
`;

/* eslint-disable react/prefer-stateless-function */
class DashboardSettingsNavbar extends React.PureComponent {
  render() {
    const { children } = this.props;

    return (
      <Container>
        <Row>
          <Col md={{ size: 3, order: 2 }} tag="main">
            <SideNav>
              <h3>Settings</h3>
              <Nav className="flex-column">
                <NavItem>
                  <NavLink
                    to="/dashboard/settings/profile"
                    exact
                    tag={RRNavLink}
                  >
                    My Profile
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    to="/dashboard/settings/billing"
                    exact
                    tag={RRNavLink}
                  >
                    Billing
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    to="/dashboard/settings/preferences"
                    exact
                    tag={RRNavLink}
                  >
                    Preferences
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    to="/dashboard/settings/security"
                    exact
                    tag={RRNavLink}
                  >
                    Account Security
                  </NavLink>
                </NavItem>
              </Nav>
            </SideNav>
          </Col>
          <Col md={{ size: 9, order: 1 }} tag="aside">
            {children}
          </Col>
        </Row>
      </Container>
    );
  }
}

DashboardSettingsNavbar.propTypes = {
  children: PropTypes.node,
};

export default withRouter(DashboardSettingsNavbar);
