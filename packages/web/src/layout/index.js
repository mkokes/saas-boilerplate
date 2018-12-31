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

const DefaultLayout = ({
  dashboardNavbarHidden,
  navbarExpand,
  brandNameLink,
  minimal,
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
      <Footer minimal={minimal} />
    </BaseLayout>
  </div>
);

const MinimalDefaultLayout = ({ children }) => (
  <DefaultLayout minimal>{children}</DefaultLayout>
);

const DashboardLayout = ({ children }) => (
  <DefaultLayout
    dashboardNavbarHidden={false}
    navbarExpand="md"
    brandNameLink="/dashboard"
    minimal
  >
    <div style={{ paddingTop: '25px', paddingBottom: '25px' }}>{children}</div>
  </DefaultLayout>
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
  dashboardNavbarHidden: PropTypes.bool,
  navbarExpand: PropTypes.string,
  brandNameLink: PropTypes.string,
  children: PropTypes.node,
  minimal: PropTypes.bool,
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

export {
  BaseLayout,
  DefaultLayout,
  MinimalDefaultLayout,
  DashboardLayout,
  DashboardSettingsLayout,
};
