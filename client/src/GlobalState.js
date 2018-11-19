import React, { createContext, Component } from 'react';
import propTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import jwtDecode from 'jwt-decode';

import { LocalStorageApi } from 'api/vendors';
import { LoginUserNoAuth } from 'graphql/mutations';
import { buildAuthHeader } from './utils/requests';

const GlobalContext = createContext({});

export const GlobalConsumer = GlobalContext.Consumer;

let setProviderInstance;
const providerPromise = new Promise(resolve => {
  setProviderInstance = resolve;
});

let setSignedIn;
const signInPromise = new Promise(resolve => {
  setSignedIn = resolve;
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

  signIn = async ({ forceSignIn = false } = {}) => {
    if (this.state.loggedIn) {
      return;
    }

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
      const accessToken = this.authAccessToken();
      const refreshToken = this.authRefreshToken();

      const accessTokenStatus = validateJWT(accessToken);
      const refreshTokenStatus = validateJWT(refreshToken);

      if (
        accessTokenStatus !== 'INVALID_TOKEN' &&
        refreshTokenStatus === 'OK'
      ) {
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
      } else {
        throw new Error('User tokens are not valid');
      }
    } catch (err) {
      console.debug(`User is not logged and/or does not exist in db`);

      this.setState(state => ({
        auth: {
          ...state.auth,
          profile: null,
          loggedIn: false,
        },
      }));

      if (forceSignIn) {
        // @TODO: go to login form

        // eslint-disable-next-line
        return signInPromise;
      }
    }
  };

  renewAccessToken = async () => {
    console.debug('Renewing access_token');

    const refreshToken = this.authRefreshToken();

    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YmYyOWZmM2UyNGY1ZjlhZWI2YWZjYWYiLCJpYXQiOjE1NDI2MjczMTUsImV4cCI6MTU0MjYyNzYxNX0.ogxvTqpDTBoGDnCcBtgPKw49v48PG0sYs1TJ-VzkwqYx';
  };

  setUserProfile = profile => {
    console.debug('Current user', profile);

    this.setState(
      state => ({
        auth: {
          ...state.auth,
          profile,
          loggedIn: true,
        },
      }),
      /* now we resolve the promise -> */ setSignedIn,
    );
  };

  setAuthTokens = ({ accessToken, refreshToken }) => {
    if (accessToken) LocalStorageApi.setItem('access_token', accessToken);
    if (refreshToken) LocalStorageApi.setItem('refresh_token', refreshToken);
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
