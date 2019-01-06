import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Navbar from 'components/Navbar';
import Footer from 'components/Footer';
import DashboardSettingsNavbar from 'components/DashboardSettingsNavbar/Loadable';

const LayoutContainer = styled.div`
  min-height: 100vh;
  background-color: rgb(244, 247, 250);
`;

const BaseLayout = ({ children }) => (
  <LayoutContainer className="flex flex-column">{children}</LayoutContainer>
);

const DefaultLayout = ({ children }) => (
  <div className="flex flex-row">
    <BaseLayout>
      <div className="flex flex-column">{children}</div>
    </BaseLayout>
  </div>
);

const DashboardBaseLayout = ({
  dashboardNavbarHidden,
  navbarExpand,
  brandNameLink,
  children,
}) => (
  <div className="flex flex-row">
    <BaseLayout>
      <Navbar
        dashboardNavbarHidden={dashboardNavbarHidden}
        expand={navbarExpand}
        brandNameLink={brandNameLink}
      />
      <div className="flex flex-column">{children}</div>
      <Footer />
    </BaseLayout>
  </div>
);

const DashboardLayout = ({ children }) => (
  <DashboardBaseLayout
    dashboardNavbarHidden={false}
    navbarExpand="md"
    brandNameLink="/dashboard"
  >
    <div style={{ paddingTop: '25px', paddingBottom: '25px' }} className="flex">
      {children}
    </div>
  </DashboardBaseLayout>
);

const DashboardLayoutWithoutSubNavbar = ({ children }) => (
  <DashboardBaseLayout
    dashboardNavbarHidden
    navbarExpand="md"
    brandNameLink="/dashboard"
  >
    <div style={{ paddingTop: '25px', paddingBottom: '25px' }} className="flex">
      {children}
    </div>
  </DashboardBaseLayout>
);

const DashboardSettingsLayout = ({ children }) => (
  <DashboardLayout>
    <DashboardSettingsNavbar>{children}</DashboardSettingsNavbar>
  </DashboardLayout>
);

BaseLayout.propTypes = {
  children: PropTypes.node,
};

DefaultLayout.propTypes = {
  children: PropTypes.node,
};

DashboardBaseLayout.propTypes = {
  dashboardNavbarHidden: PropTypes.bool,
  navbarExpand: PropTypes.string,
  brandNameLink: PropTypes.string,
  children: PropTypes.node,
};

DashboardLayout.propTypes = {
  children: PropTypes.node,
};

DashboardSettingsLayout.propTypes = {
  children: PropTypes.node,
};

export {
  BaseLayout,
  DefaultLayout,
  DashboardLayout,
  DashboardLayoutWithoutSubNavbar,
  DashboardSettingsLayout,
};
