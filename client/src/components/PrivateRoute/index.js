import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import { GlobalConsumer } from 'GlobalState';

export class PrivateRoute extends React.PureComponent {
  render() {
    const { redirect: pathname, children, ...rest } = this.props;

    return (
      <GlobalConsumer>
        {({ loggedIn }) => (
          <>
            {!loggedIn ? (
              <Route
                {...rest}
                render={props => (
                  <Redirect
                    to={{
                      pathname,
                      state: { from: props.location },
                    }}
                  />
                )}
              />
            ) : null}
          </>
        )}
      </GlobalConsumer>
    );
  }
}

PrivateRoute.defaultProps = {
  redirect: '/auth/login',
};

PrivateRoute.propTypes = {
  redirect: PropTypes.string,
  location: PropTypes.object,
  children: PropTypes.object,
};

export default PrivateRoute;
