/**
 *
 * FreshdeskLoginPage
 *
 */

import React from 'react';
import { withApollo } from 'react-apollo';
import styled from 'styled-components';

import Loader from 'components/Loader';
import { getProvider as getGlobalProvider } from 'GlobalState';
import { buildAuthHeader } from 'utils/requests';
import { GetFreshdeskSSO } from 'graphql/queries';
import Delayed from 'components/Delayed';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
`;

export default class freshdeskLoginPage extends React.PureComponent {
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
    } catch (err) {
      console.error(err);
      history.push('/auth/login', { from: location });
    }
  }

  render() {
    return null;
  }
}

export const FreshdeskLoginPage = withApollo(freshdeskLoginPage);
