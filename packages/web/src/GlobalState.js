import React, { createContext, Component } from 'react';
import propTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import jwtDecode from 'jwt-decode';

import { LocalStorageApi, AnalyticsApi } from 'api/vendors';
import { LoginUserNoAuth, RefreshAccessToken } from 'graphql/mutations';
import { buildAuthHeader } from './utils/requests';

const GlobalContext = createContext({});

export const GlobalConsumer = GlobalContext.Consumer;

let setProviderInstance;
const providerPromise = new Promise(resolve => {
  setProviderInstance = resolve;
});

export const getProvider = () => providerPromise;

/* eslint-disable no-console */
class Provider extends Component {
  state = {
    appLoad: false,
    apolloClient: this.props.client,
    auth: {
      accessToken: LocalStorageApi.getItem('access_token') || undefined,
      refreshToken: LocalStorageApi.getItem('refresh_token') || undefined,
    },
  };

  setAppLoad(val) {
    this.setState({ appLoad: val });
  }

  authAccessToken() {
    return this.state.auth.accessToken;
  }

  authRefreshToken() {
    return this.state.auth.refreshToken;
  }

  apolloClient() {
    return this.state.apolloClient;
  }

  isLoggedIn() {
    return this.state.auth.loggedIn;
  }

  signIn = async () => {
    if (this.state.loggedIn) return;

    console.debug(`Checking if user is logged in ...`);

    function validateJWT(token) {
      if (!token) return 'INVALID_TOKEN';

      try {
        const isExpired = jwtDecode(token).exp < Date.now() / 1000;
        if (isExpired) return 'EXPIRED';

        return 'OK';
      } catch (e) {
        console.error(e);
        return 'INVALID_TOKEN';
      }
    }

    try {
      let accessToken = this.authAccessToken();
      const refreshToken = this.authRefreshToken();

      let accessTokenStatus = validateJWT(accessToken);
      const refreshTokenStatus = validateJWT(refreshToken);

      if (accessTokenStatus === 'EXPIRED' && refreshTokenStatus === 'OK') {
        accessToken = await this.refreshAccessTokenReq();
        accessTokenStatus = 'OK';
      }
      if (accessTokenStatus !== 'OK' && refreshTokenStatus !== 'OK') {
        throw new Error('User tokens are not valid');
      }

      const {
        data: { profile },
      } = await this.apolloClient().mutate({
        mutation: LoginUserNoAuth,
        context: {
          headers: buildAuthHeader(accessToken),
        },
      });
      console.debug('User is logged in and has a profile');

      this.setUserProfile(profile);
    } catch (err) {
      console.debug(`User is not logged`);

      this.setState(state => ({
        auth: {
          ...state.auth,
          profile: null,
          loggedIn: false,
        },
      }));
    }
  };

  signUp = async () => {
    await this.signIn();
    const { profile } = this.state.auth;

    if (profile) AnalyticsApi.alias(profile._id);
  };

  logIn = async () => {
    await this.signIn();
    const { profile } = this.state.auth;

    if (profile) AnalyticsApi.identify(profile._id);
  };

  setUserProfile = profile => {
    console.debug('Current user', profile);

    this.setState(state => ({
      auth: {
        ...state.auth,
        profile,
        loggedIn: true,
      },
    }));
  };

  refreshAccessTokenReq = async () => {
    console.debug('Renewing access token');

    const refreshToken = this.authRefreshToken();

    if (!refreshToken)
      throw new Error('no refresh token to renew access token');

    const { data } = await this.apolloClient().mutate({
      mutation: RefreshAccessToken,
      variables: {
        refreshToken,
      },
    });

    const { accessToken } = data.refreshAccessToken;
    console.debug('Got new access token', accessToken);

    await this.setAuthTokens({ accessToken });

    return accessToken;
  };

  setAuthTokens = async ({ accessToken, refreshToken }) => {
    if (accessToken) {
      console.debug('Set access_token:', accessToken);
      LocalStorageApi.setItem('access_token', accessToken);
      this.setState(state => ({
        auth: {
          ...state.auth,
          accessToken,
        },
      }));
    }
    if (refreshToken) {
      console.debug('Set refresh_token:', refreshToken);
      LocalStorageApi.setItem('refresh_token', refreshToken);
      this.setState(state => ({
        auth: {
          ...state.auth,
          refreshToken,
        },
      }));
    }
  };

  logOut = async ({ forcedLogOut = false } = {}) => {
    LocalStorageApi.removeItem('access_token');
    LocalStorageApi.removeItem('refresh_token');

    this.setState({
      auth: {
        accessToken: undefined,
        refreshToken: undefined,
        profile: null,
        loggedIn: false,
      },
    });

    if (!forcedLogOut) AnalyticsApi.track('Log out');

    console.debug('Logout user');
  };

  async componentDidMount() {
    await this.signIn();

    setProviderInstance(this);
    this.setAppLoad(true);
  }

  render() {
    return (
      <GlobalContext.Provider
        value={{
          appLoadStatus: this.state.appLoad,
          userProfile: this.state.auth.profile,
          loggedIn: this.isLoggedIn(),
          signIn: this.signIn,
          signUp: this.signUp,
          logIn: this.logIn,
          logOut: this.logOut,
          setAuthTokens: this.setAuthTokens,
          setUserProfile: this.setUserProfile,
        }}
      >
        {this.props.children}
      </GlobalContext.Provider>
    );
  }
}

Provider.propTypes = {
  children: propTypes.node,
  client: propTypes.object,
};

export const GlobalProvider = withApollo(Provider);
