import React from 'react';
import PropTypes from 'prop-types';

const DefaultLayout = ({ children }) => (
  <React.Fragment>{children}</React.Fragment>
);

DefaultLayout.propTypes = {
  children: PropTypes.object,
};

export default DefaultLayout;
