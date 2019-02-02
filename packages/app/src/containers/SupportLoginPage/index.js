/**
 *
 * SupportLoginPage
 *
 */

import React from 'react';
import { withApollo } from 'react-apollo';

import { getProvider as getGlobalProvider } from 'GlobalState';
import { buildAuthHeader } from 'utils/requests';
import { GetFreshdeskSSO } from 'graphql/queries';

class supportLoginPage extends React.PureComponent {
  async componentDidMount() {
    const { client, history, location } = this.props;

    try {
      const globalProvider = await getGlobalProvider();

      if (!globalProvider.isLoggedIn()) throw new Error('NEED_LOGIN');

      const accessToken = await globalProvider.authAccessToken();

      const {
        data: { getFreshdeskSSO },
      } = await client.query({
        query: GetFreshdeskSSO,
        context: {
          headers: buildAuthHeader(accessToken),
        },
      });

      window.location = getFreshdeskSSO.url;
    } catch (_) {
      history.push('/auth/login', { from: location });
    }
  }

  render() {
    return null;
  }
}

export default withApollo(supportLoginPage);
