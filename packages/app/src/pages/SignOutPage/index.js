/**
 *
 * SignOutPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';

import { getProvider as getGlobalProvider } from 'GlobalState';

/* eslint-disable react/prefer-stateless-function */
export default class SignOutPage extends React.PureComponent {
  async componentDidMount() {
    const { history, location } = this.props;
    const { redirectTo } = queryString.parse(location.search);

    const globalProvider = await getGlobalProvider();

    globalProvider.logOut({ isForced: false });
    history.push(redirectTo || '/auth/login');
  }

  render() {
    return null;
  }
}
SignOutPage.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
};
