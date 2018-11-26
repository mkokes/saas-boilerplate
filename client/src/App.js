import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import {
  BrowserRouter as Router,
  Route as DefaultRoute,
  Switch,
} from 'react-router-dom';

import { DefaultLayout, DashboardLayout } from 'layout';

import AppLoadPage from 'components/AppLoadPage';
import PrivateRoute from 'components/PrivateRoute';
import RouteAnalytics from 'components/RouteAnalytics';
import ScrollToTop from 'components/ScrollToTop';
import NotFoundPage from 'components/NotFoundPage/Loadable';

import HomePage from 'containers/HomePage/Loadable';
// import ContactPage from 'containers/ContactPage/Loadable';
import SignupPage from 'containers/SignupPage/Loadable';
import LoginPage from 'containers/LoginPage/Loadable';
import ForgotPasswordPage from 'containers/ForgotPasswordPage/Loadable';
import ResetPasswordPage from 'containers/ResetPasswordPage/Loadable';
// import EmailConfirmationPage from 'containers/EmailConfirmationPage/Loadable';

import MainPage from 'containers/Dashboard/User/MainPage';
import EmailVerificationPage from 'containers/Dashboard/User/EmailVerificationPage';

import { GlobalConsumer } from 'GlobalState';

const Route = ({
  component: Component,
  layout: Layout = DefaultLayout,
  ...rest
}) => (
  <DefaultRoute
    {...rest}
    render={props => (
      <React.Fragment>
        <PrivateRoute exact path={rest.path} enable={rest.protected || false}>
          <RouteAnalytics key={rest.path} {...props}>
            <Layout>
              <Component {...props} />
            </Layout>
          </RouteAnalytics>
        </PrivateRoute>
      </React.Fragment>
    )}
  />
);

Route.propTypes = {
  component: PropTypes.func,
  layout: PropTypes.func,
  protected: PropTypes.bool,
};

export default function App() {
  return (
    <GlobalConsumer>
      {({ appLoadStatus }) => (
        <>
          {appLoadStatus ? (
            <>
              <Helmet titleTemplate="%s - SaaS boilerplate" />
              <Router>
                <ScrollToTop>
                  <Switch>
                    <Route exact path="/" component={HomePage} />
                    <Route exact path="/signup" component={SignupPage} />

                    <Route exact path="/auth/login" component={LoginPage} />
                    <Route
                      exact
                      path="/auth/forgot-password"
                      component={ForgotPasswordPage}
                    />
                    <Route
                      exact
                      path="/auth/reset-password"
                      component={ResetPasswordPage}
                    />

                    <Route
                      protected
                      exact
                      path="/dashboard/index"
                      component={MainPage}
                      layout={DashboardLayout}
                    />
                    <Route
                      protected
                      exact
                      path="/dashboard/email-verification"
                      component={EmailVerificationPage}
                      layout={DashboardLayout}
                    />

                    <Route component={NotFoundPage} />
                  </Switch>
                </ScrollToTop>
              </Router>
            </>
          ) : (
            <AppLoadPage />
          )}
        </>
      )}
    </GlobalConsumer>
  );
}
