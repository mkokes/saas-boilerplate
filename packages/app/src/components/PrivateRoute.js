import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

export class PrivateRoute extends React.PureComponent {
  render() {
    const {
      redirect: pathname,
      children,
      loggedIn,
      enable,
      ...rest
    } = this.props;

    return (
      <>
        {!loggedIn && enable ? (
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
        ) : (
          children
        )}
      </>
    );
  }
}

PrivateRoute.defaultProps = {
  redirect: '/auth/login',
  enable: false,
};

PrivateRoute.propTypes = {
  redirect: PropTypes.string,
  location: PropTypes.object,
  children: PropTypes.object,
  loggedIn: PropTypes.bool,
  enable: PropTypes.bool,
};

export default PrivateRoute;
