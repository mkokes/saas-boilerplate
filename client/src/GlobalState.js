import React, { createContext } from 'react';
import propTypes from 'prop-types';

const GlobalContext = createContext({});

export const GlobalConsumer = GlobalContext.Consumer;

let setProviderInstance;
const providerPromise = new Promise(resolve => {
  setProviderInstance = resolve;
});

export const getProvider = () => providerPromise;

export class GlobalProvider extends React.PureComponent {
  state = {
    auth: {
      loggedIn: false,
      token: null,
    },
  };

  async componentDidMount() {
    // await this.reloadUserAddress();

    // try and sign in!
    // await this.signIn({ dontForceSignIn: true });

    setProviderInstance(this);
  }

  authToken() {
    return this.state.auth.token;
  }

  isLoggedIn() {
    return this.state.auth.loggedIn;
  }

  signIn = async () => null;

  render() {
    return (
      <GlobalContext.Provider value={{}}>
        {this.props.children}
      </GlobalContext.Provider>
    );
  }
}

GlobalProvider.propTypes = {
  children: propTypes.node,
};
