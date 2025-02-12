import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Navbar from 'components/Dashboard/Navbar/Loadable';
import Footer from 'components/Footer/Loadable';
import DashboardSettingsNavbar from 'components/Dashboard/Settings/Navbar/Loadable';

import config from 'config';
const { LEGAL_COMPANY_NAME, WEBSITE_URL } = config;

const BaseLayoutContainer = styled.div`
  min-height: 100vh;
`;

const DefaultLayout = ({ children }) => <BaseLayout>{children}</BaseLayout>;

const TransactionalLayout = ({ headerTitle, children }) => (
  <BaseLayout>
    <div
      className="pb-4 text-center"
      style={{
        marginBottom: !headerTitle ? '1em' : '',
      }}
    >
      <a href={WEBSITE_URL}>
        <img src="/images/logo.png" width="112" height="112" alt="brand logo" />
      </a>
      {headerTitle && <h1 className="color-primary-theme">{headerTitle}</h1>}
    </div>
    {children}
    <p className="mt-4 text-center small" style={{ color: '#b8c2cc' }}>
      ® {new Date().getFullYear()} {LEGAL_COMPANY_NAME}. All rights reserved.
    </p>
  </BaseLayout>
);

const BaseLayout = ({ children }) => (
  <BaseLayoutContainer className="flex flex-column justify-content-center">
    {children}
  </BaseLayoutContainer>
);

const DashboardBaseLayout = ({
  dashboardNavbarHidden,
  brandNameLink,
  children,
}) => (
  <BaseLayout>
    <Navbar
      dashboardNavbarHidden={dashboardNavbarHidden}
      brandNameLink={brandNameLink}
    />
    {children}
    <Footer />
  </BaseLayout>
);

const DashboardLayout = ({ children }) => (
  <DashboardBaseLayout dashboardNavbarHidden={false} brandNameLink="/dashboard">
    <div style={{ paddingTop: '25px', paddingBottom: '25px' }} className="flex">
      {children}
    </div>
  </DashboardBaseLayout>
);

const DashboardLayoutWithoutSubNavbar = ({ children }) => (
  <DashboardBaseLayout dashboardNavbarHidden brandNameLink="/dashboard">
    <div className="flex">{children}</div>
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
};

BaseLayout.propTypes = {
  children: PropTypes.node,
};

DashboardLayoutWithoutSubNavbar.propTypes = {
  children: PropTypes.node,
};

DashboardBaseLayout.propTypes = {
  dashboardNavbarHidden: PropTypes.bool,
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
