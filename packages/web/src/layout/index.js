import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Navbar from 'components/Navbar';
import Footer from 'components/Footer';

const LayoutContainer = styled.div`
  min-height: 100vh;
`;

const DefaultLayout = ({ brandNameLink, minimal, children }) => (
  <Fragment>
    <div className="flex flex-row">
      <LayoutContainer className="flex flex-column">
        <Navbar brandNameLink={brandNameLink} />
        <div className="flex flex-column">{children}</div>
        <Footer minimal={minimal} />
      </LayoutContainer>
    </div>
  </Fragment>
);

const MinimalDefaultLayout = ({ children }) => (
  <DefaultLayout minimal>{children}</DefaultLayout>
);

const DashboardLayout = ({ children }) => (
  <DefaultLayout brandNameLink="/dashboard/index" minimal>
    {children}
  </DefaultLayout>
);

DefaultLayout.propTypes = {
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

export default DefaultLayout;
export { DefaultLayout, MinimalDefaultLayout, DashboardLayout };
