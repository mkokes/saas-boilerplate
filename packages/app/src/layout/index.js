import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Navbar from 'components/Navbar';
import Footer from 'components/Footer';
import DashboardSettingsNavbar from 'components/DashboardSettingsNavbar/Loadable';

const BaseLayoutContainer = styled.div`
  min-height: 100vh;
`;

const DefaultLayout = ({ children }) => <BaseLayout>{children}</BaseLayout>;

const TransactionalLayout = ({ headerTitle, marginTop, children }) => (
  <BaseLayout>
    <div
      className="pb-4 text-center"
      style={{
        marginTop: marginTop || '',
        marginBottom: !headerTitle ? '1em' : '',
      }}
    >
      <a href={process.env.REACT_APP_WEBSITE_URL}>
        <img src="/logo.png" alt="brand logo" width="112" height="112" />
      </a>
      {headerTitle && <h1>{headerTitle}</h1>}
    </div>
    {children}
  </BaseLayout>
);

const BaseLayout = ({ children }) => (
  <BaseLayoutContainer className="flex flex-column justify-content-center">
    {children}
  </BaseLayoutContainer>
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

TransactionalLayout.propTypes = {
  children: PropTypes.node,
  headerTitle: PropTypes.string,
  marginTop: PropTypes.string,
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
  TransactionalLayout,
  BaseLayout,
  DashboardLayout,
  DashboardLayoutWithoutSubNavbar,
  DashboardSettingsLayout,
};
