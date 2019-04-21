/**
 *
 * SignOutPage
 *
 */

import React from 'react';

import { getProvider as getGlobalProvider } from 'GlobalState';

/* eslint-disable react/prefer-stateless-function */
export default class SignOutPage extends React.PureComponent {
  async componentDidMount() {
    const globalProvider = await getGlobalProvider();

    globalProvider.logOut(false);
  }

  render() {
    return null;
  }
}
