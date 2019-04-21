import React, { createContext, Component } from 'react';
import propTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import jwtDecode from 'jwt-decode';
import MomentTimezone from 'moment-timezone';
import { toast } from 'react-toastify';

import { LocalStorageApi, AnalyticsApi } from 'api/vendors';
import { LOGIN_USER_NO_AUTH, REFRESH_ACCESS_TOKEN } from 'graphql/mutations';
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
    appLoadStatus: false,
    apolloClient: this.props.client,
    auth: {
      accessToken: LocalStorageApi.getItem('access_token') || undefined,
      refreshToken: LocalStorageApi.getItem('refresh_token') || undefined,
    },
  };

  setAppLoadStatus(status) {
    this.setState({ appLoadStatus: status });
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

  loadUserFromToken = async () => {
    if (this.state.loggedIn) return;

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
        mutation: LOGIN_USER_NO_AUTH,
        context: {
          headers: buildAuthHeader(accessToken),
        },
      });

      this.setUserProfile(profile);
    } catch (err) {
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
    await this.logIn();
    const { profile } = this.state.auth;

    if (profile) {
      AnalyticsApi.mixpanel.alias(profile._id);
    }
  };

  logIn = async () => {
    await this.loadUserFromToken();
    const { profile } = this.state.auth;

    if (profile) {
      AnalyticsApi.mixpanel.identify(profile._id);
      AnalyticsApi.mixpanel.people.set({
        $last_seen: new Date(),
      });
    }
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

    MomentTimezone.tz.setDefault(profile.timezone);
  };

  refreshAccessTokenReq = async () => {
    const refreshToken = this.authRefreshToken();

    if (!refreshToken)
      throw new Error('no refresh token to renew access token');

    const { data } = await this.apolloClient().mutate({
      mutation: REFRESH_ACCESS_TOKEN,
      variables: {
        refreshToken,
      },
    });

    const { accessToken } = data.refreshAccessToken;

    await this.setAuthTokens({ accessToken });

    return accessToken;
  };

  setAuthTokens = async ({ accessToken, refreshToken }) => {
    if (accessToken) {
      LocalStorageApi.setItem('access_token', accessToken);
      this.setState(state => ({
        auth: {
          ...state.auth,
          accessToken,
        },
      }));
    }
    if (refreshToken) {
      LocalStorageApi.setItem('refresh_token', refreshToken);
      this.setState(state => ({
        auth: {
          ...state.auth,
          refreshToken,
        },
      }));
    }
  };

  logOut = async isForced => {
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

    if (isForced) {
      toast.error(`An error ocurred. Please log in again.`, {
        position: toast.POSITION.TOP_LEFT,
        draggable: false,
      });
    } else {
      toast.info(`Logged out successfully.`, {
        position: toast.POSITION.TOP_LEFT,
        hideProgressBar: true,
        pauseOnHover: false,
        autoClose: 3000,
        draggable: false,
      });
    }
  };

  async componentDidMount() {
    await this.logIn();

    setProviderInstance(this);
    this.setAppLoadStatus(true);
  }

  render() {
    return (
      <GlobalContext.Provider
        value={{
          appLoadStatus: this.state.appLoadStatus,
          userProfile: this.state.auth.profile,
          loggedIn: this.isLoggedIn(),
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
