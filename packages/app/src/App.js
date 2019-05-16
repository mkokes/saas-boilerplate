import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Redirect } from 'react-router';
import {
  BrowserRouter as Router,
  Route as DefaultRoute,
  Switch,
} from 'react-router-dom';

import SplashScreen from 'components/SplashScreen';
import ScrollToTop from 'components/ScrollToTop';
import Middleware from 'components/Middleware';
import PrivateRoute from 'components/PrivateRoute';
import RouteAnalytics from 'components/RouteAnalytics';

import SupportPage from 'pages/SupportPage/Loadable';
import PricingPage from 'pages/PricingPage/Loadable';
import FeedbackPage from 'pages/FeedbackPage/Loadable';
import SignupPage from 'pages/SignupPage/Loadable';
import LoginPage from 'pages/LoginPage/Loadable';
import ForgotPasswordPage from 'pages/ForgotPasswordPage/Loadable';
import ResetPasswordPage from 'pages/ResetPasswordPage/Loadable';
import EmailConfirmationPage from 'pages/EmailConfirmationPage/Loadable';
import MainPage from 'pages/Dashboard/User/MainPage/Loadable';
import ProfilePage from 'pages/Dashboard/User/Settings/ProfilePage/Loadable';
import PreferencesPage from 'pages/Dashboard/User/Settings/PreferencesPage/Loadable';
import BillingPage from 'pages/Dashboard/User/Settings/BillingPage/Loadable';
import SecurityPage from 'pages/Dashboard/User/Settings/SecurityPage/Loadable';
import ApiPage from 'pages/Dashboard/User/Settings/ApiPage/Loadable';
import EmailVerificationPage from 'pages/Dashboard/User/EmailVerificationPage/Loadable';
import SignOutPage from 'pages/SignOutPage/Loadable';
import ProcessingPage from 'pages/ProcessingPage/Loadable';
import NotFoundPage from 'pages/NotFoundPage/Loadable';

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
                      path="/support"
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
                      path="/dashboard/feedback"
                      component={FeedbackPage}
                      layout={DashboardLayout}
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
                    />
                    <Route
                      exact
                      path="/auth/login"
                      component={LoginPage}
                      layout={TransactionalLayout}
                      headerTitle="Authentication"
                    />
                    <Route
                      exact
                      path="/auth/forgot-password"
                      component={ForgotPasswordPage}
                      layout={TransactionalLayout}
                      headerTitle="Forgot your password?"
                    />
                    <Route
                      exact
                      path="/auth/reset-password"
                      component={ResetPasswordPage}
                      layout={TransactionalLayout}
                      headerTitle="Reset Password"
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
                      path="/dashboard/settings/profile"
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
                      path="/dashboard/settings/api"
                      component={ApiPage}
                      layout={DashboardSettingsLayout}
                    />
                    <Route
                      protected
                      exact
                      path="/dashboard/email-verification"
                      component={EmailVerificationPage}
                      layout={DashboardLayoutWithoutSubNavbar}
                    />

                    <Route exact path="/signout" component={SignOutPage} />

                    <Route component={NotFoundPage} />
                  </Switch>
                </ScrollToTop>
              </Router>
            </>
          ) : (
            <SplashScreen />
          )}
        </>
      )}
    </GlobalConsumer>
  );
}
