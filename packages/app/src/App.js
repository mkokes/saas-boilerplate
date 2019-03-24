// v3
import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Redirect } from 'react-router';
import {
  BrowserRouter as Router,
  Route as DefaultRoute,
  Switch,
} from 'react-router-dom';

import AppLoader from 'components/AppLoader';
import ScrollToTop from 'components/ScrollToTop';
import NotFoundPage from 'components/NotFoundPage/Loadable';
import Middleware from 'containers/Middleware';
import PrivateRoute from 'components/PrivateRoute';
import RouteAnalytics from 'components/RouteAnalytics';

import SupportPage from 'containers/SupportPage';
import PricingPage from 'containers/PricingPage/Loadable';
import SignupPage from 'containers/SignupPage/Loadable';
import LoginPage from 'containers/LoginPage/Loadable';
import ForgotPasswordPage from 'containers/ForgotPasswordPage/Loadable';
import ResetPasswordPage from 'containers/ResetPasswordPage/Loadable';
import EmailConfirmationPage from 'containers/EmailConfirmationPage/Loadable';
import MainPage from 'containers/Dashboard/User/MainPage/Loadable';
import ProfilePage from 'containers/Dashboard/User/Settings/ProfilePage/Loadable';
import PreferencesPage from 'containers/Dashboard/User/Settings/PreferencesPage/Loadable';
import BillingPage from 'containers/Dashboard/User/Settings/BillingPage/Loadable';
import SecurityPage from 'containers/Dashboard/User/Settings/SecurityPage/Loadable';
import EmailVerificationPage from 'containers/Dashboard/User/EmailVerificationPage/Loadable';
import SignOutPage from 'containers/SignOutPage/Loadable';
import ProcessingPage from 'containers/ProcessingPage/Loadable';

import {
  DefaultLayout,
  TransactionalLayout,
  BaseLayout,
  DashboardLayout,
  DashboardSettingsLayout,
  DashboardLayoutWithoutSubNavbar,
} from 'layout';
import { GlobalConsumer } from 'GlobalState';

const Route = ({
  component: Component,
  layout: Layout = DefaultLayout,
  ...rest
}) => (
  <DefaultRoute
    {...rest}
    render={props => (
      <GlobalConsumer>
        {({ loggedIn, userProfile }) => (
          <PrivateRoute exact loggedIn={loggedIn} enable={rest.protected}>
            <Middleware user={userProfile} path={rest.path}>
              <RouteAnalytics {...props}>
                <Layout {...rest}>
                  <Component {...props} />
                </Layout>
              </RouteAnalytics>
            </Middleware>
          </PrivateRoute>
        )}
      </GlobalConsumer>
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
                    <Route
                      exact
                      path="/"
                      component={() => <Redirect to="/dashboard" />}
                    />

                    <Route
                      exact
                      path="/contact-support"
                      component={SupportPage}
                      layout={TransactionalLayout}
                    />
                    <Route
                      exact
                      path="/pricing"
                      component={PricingPage}
                      layout={TransactionalLayout}
                      headerTitle="Pricing"
                    />
                    <Route
                      exact
                      path="/signup"
                      component={SignupPage}
                      layout={TransactionalLayout}
                      headerTitle="Let's get started!"
                    />
                    <Route
                      exact
                      path="/processing"
                      component={ProcessingPage}
                      layout={BaseLayout}
                    />
                    <Route
                      exact
                      path="/confirm-email"
                      component={EmailConfirmationPage}
                      layout={TransactionalLayout}
                      headerTitle="Email address confirmation"
                      marginTop="-15em"
                    />
                    <Route
                      exact
                      path="/auth/login"
                      component={LoginPage}
                      layout={TransactionalLayout}
                      headerTitle="Authentication"
                      marginTop="-3em"
                    />
                    <Route
                      exact
                      path="/auth/forgot-password"
                      component={ForgotPasswordPage}
                      layout={TransactionalLayout}
                      marginTop="-15em"
                    />
                    <Route
                      exact
                      path="/auth/reset-password"
                      component={ResetPasswordPage}
                      layout={TransactionalLayout}
                      headerTitle="Reset Password"
                      marginTop="-15em"
                    />
                    <Route
                      protected
                      exact
                      path="/dashboard"
                      component={MainPage}
                      layout={DashboardLayout}
                    />
                    <Route
                      protected
                      exact
                      path="/dashboard/settings"
                      component={ProfilePage}
                      layout={DashboardSettingsLayout}
                    />
                    <Route
                      protected
                      exact
                      path="/dashboard/settings/preferences"
                      component={PreferencesPage}
                      layout={DashboardSettingsLayout}
                    />
                    <Route
                      protected
                      exact
                      path="/dashboard/settings/billing"
                      component={BillingPage}
                      layout={DashboardSettingsLayout}
                    />
                    <Route
                      protected
                      exact
                      path="/dashboard/settings/security"
                      component={SecurityPage}
                      layout={DashboardSettingsLayout}
                    />
                    <Route
                      protected
                      exact
                      path="/dashboard/email-verification"
                      component={EmailVerificationPage}
                      layout={DashboardLayoutWithoutSubNavbar}
                    />

                    <Route
                      protected
                      exact
                      path="/signout"
                      component={SignOutPage}
                    />

                    <Route component={NotFoundPage} />
                  </Switch>
                </ScrollToTop>
              </Router>
            </>
          ) : (
            <AppLoader />
          )}
        </>
      )}
    </GlobalConsumer>
  );
}
