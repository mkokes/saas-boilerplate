import React, { createContext, Component } from 'react';
import propTypes from 'prop-types';
import { withApollo } from 'react-apollo';

import { LocalStorageApi } from 'api/vendors';
import { LoginUserNoAuth } from 'graphql/mutations';
import { buildAuthHeaders } from './utils/requests';

const GlobalContext = createContext({});

export const GlobalConsumer = GlobalContext.Consumer;

let setProviderInstance;
const providerPromise = new Promise(resolve => {
  setProviderInstance = resolve;
});

export const getProvider = () => providerPromise;

const AUTH = 'auth';
// const TOKEN_ALGORITHM = 'HS256';

class Provider extends Component {
  state = {
    apolloClient: this.props.client,
    auth: LocalStorageApi.getItem(AUTH) || {},
  };

  authToken() {
    return this.state.auth.token;
  }

  apolloClient() {
    return this.state.apolloClient;
  }

  isLoggedIn() {
    return this.state.auth.loggedIn;
  }

  signIn = async ({ dontForceSignIn } = {}) => {
    /* console.debug('dontForceSignIn', dontForceSignIn);
    if (this.state.loggedIn) {
      return;
    }

    console.debug(`Checking if user is logged in ...`);

    try {
      const token = this.authToken();

      const {
        data: { profile },
      } = await this.apolloClient().mutate({
        mutation: LoginUserNoAuth,
        context: {
          headers: buildAuthHeaders(token),
        },
      });

      console.debug(`User is logged in and has a profile`);

      this.setUserProfile(profile);
    } catch (err) {
      console.debug(`User is not logged and/or does not have a profile`);

      this.setState(state => ({
        auth: {
          ...state.auth,
          token: undefined,
          profile: null,
          loggedIn: false,
        },
      }));

      if (!dontForceSignIn) {
        // this.showModal({ name: SIGN_IN });
      }
    } */
  };

  setUserProfile = profile => {
    console.log('Current user', profile);

    this.setState(state => ({
      auth: {
        ...state.auth,
        profile,
        // need this on both this function and setUserProfile() since they can be called independently of each other
        loggedIn: true,
      },
    }));
  };

  async componentDidMount() {
    // try and sign in!
    await this.signIn({ dontForceSignIn: true });

    setProviderInstance(this);
  }

  render() {
    return (
      <GlobalContext.Provider
        value={{
          userProfile: this.state.auth.profile,
          loggedIn: this.isLoggedIn(),
          signIn: this.signIn,
          setAuthTokenFromSignature: this.setAuthTokenFromSignature,
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
