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
  state = {};

  async componentDidMount() {
    // await this.reloadUserAddress();

    // try and sign in!
    // await this.signIn({ dontForceSignIn: true });

    setProviderInstance(this);
  }

  render() {
    return (
      <GlobalContext.Provider value={{}}>
        {this.props.children}
      </GlobalContext.Provider>
    );
  }
}

GlobalProvider.propTypes = {
  children: propTypes.object,
};
