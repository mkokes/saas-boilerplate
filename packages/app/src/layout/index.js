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

const DefaultLayout = ({ children }) => <BaseLayout>{children}</BaseLayout>;

const BaseLayout = ({ children }) => (
  <LayoutContainer className="flex flex-column justify-content-center">
    {children}
  </LayoutContainer>
);

const DashboardBaseLayout = ({
  dashboardNavbarHidden,
  navbarExpand,
  brandNameLink,
  children,
}) => (
  <BaseLayout>
    <Navbar
      dashboardNavbarHidden={dashboardNavbarHidden}
      expand={navbarExpand}
      brandNameLink={brandNameLink}
    />
    {children}
    <Footer />
  </BaseLayout>
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

DefaultLayout.propTypes = {
  children: PropTypes.node,
};

BaseLayout.propTypes = {
  children: PropTypes.node,
};

DashboardLayoutWithoutSubNavbar.propTypes = {
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
  DefaultLayout,
  BaseLayout,
  DashboardLayout,
  DashboardLayoutWithoutSubNavbar,
  DashboardSettingsLayout,
};
