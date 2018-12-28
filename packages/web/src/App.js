import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import {
  BrowserRouter as Router,
  Route as DefaultRoute,
  Switch,
} from 'react-router-dom';

import AppLoader from 'components/AppLoader';
import ScrollToTop from 'components/ScrollToTop';
import NotFoundPage from 'components/NotFoundPage/Loadable';
import Middleware from 'components/Middleware';
import PrivateRoute from 'components/PrivateRoute';
import RouteAnalytics from 'components/RouteAnalytics';
import AboutPage from 'components/AboutPage/Loadable';
import LegalTermsPage from 'components/LegalTermsPage/Loadable';

import HomePage from 'containers/HomePage/Loadable';
import ContactPage from 'containers/ContactPage/Loadable';
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

import {
  DefaultLayout,
  MinimalDefaultLayout,
  DashboardLayout,
  DashboardSettingsLayout,
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
                <Layout>
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
                    <Route exact path="/" component={HomePage} />
                    <Route exact path="/contact" component={ContactPage} />
                    <Route exact path="/about" component={AboutPage} />
                    <Route
                      exact
                      path="/legal/terms"
                      component={LegalTermsPage}
                    />
                    <Route exact path="/pricing" component={PricingPage} />

                    <Route
                      exact
                      path="/signup"
                      component={SignupPage}
                      layout={MinimalDefaultLayout}
                    />

                    <Route
                      exact
                      path="/auth/login"
                      component={LoginPage}
                      layout={MinimalDefaultLayout}
                    />
                    <Route
                      exact
                      path="/auth/forgot-password"
                      component={ForgotPasswordPage}
                      layout={MinimalDefaultLayout}
                    />
                    <Route
                      exact
                      path="/auth/reset-password"
                      component={ResetPasswordPage}
                      layout={MinimalDefaultLayout}
                    />
                    <Route
                      protected
                      exact
                      path="/signout"
                      component={SignOutPage}
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
                      layout={DashboardLayout}
                    />

                    <Route
                      exact
                      path="/confirm-email"
                      component={EmailConfirmationPage}
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
