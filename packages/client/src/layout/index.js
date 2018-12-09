import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Navbar from 'components/Navbar';
import DashboardNavbar from 'components/DashboardNavbar';
import DashboardSettingsWrapper from 'components/DashboardSettingsWrapper';
import Footer from 'components/Footer';

const LayoutContainer = styled.div`
  min-height: 100vh;
`;

// @TODO: Refactor to avoid duplicate code.

const DefaultLayout = ({ children }) => (
  <React.Fragment>
    <div className="flex flex-row">
      <LayoutContainer className="flex flex-column">
        <Navbar />
        <div className="flex flex-column">{children}</div>
        <Footer />
      </LayoutContainer>
    </div>
  </React.Fragment>
);

const MinimalDefaultLayout = ({ children }) => (
  <React.Fragment>
    <div className="flex flex-row">
      <LayoutContainer className="flex flex-column">
        <Navbar />
        <div className="flex flex-column">{children}</div>
        <Footer minimal />
      </LayoutContainer>
    </div>
  </React.Fragment>
);

const DashboardLayout = ({ children }) => (
  <React.Fragment>
    <div className="flex flex-row">
      <LayoutContainer className="flex flex-column">
        <Navbar navbarBrandLink="/dashboard/index" />
        <div className="flex flex-column">
          <DashboardNavbar />
          {children}
        </div>
        <Footer minimal />
      </LayoutContainer>
    </div>
  </React.Fragment>
);

const DashboardSettingsLayout = ({ children }) => (
  <DashboardLayout>
    <DashboardSettingsWrapper>{children}</DashboardSettingsWrapper>
  </DashboardLayout>
);

DefaultLayout.propTypes = {
  children: PropTypes.node,
};

MinimalDefaultLayout.propTypes = {
  children: PropTypes.node,
};

DashboardLayout.propTypes = {
  children: PropTypes.node,
};

DashboardSettingsLayout.propTypes = {
  children: PropTypes.node,
};

export default DefaultLayout;
export {
  DefaultLayout,
  MinimalDefaultLayout,
  DashboardLayout,
  DashboardSettingsLayout,
};
