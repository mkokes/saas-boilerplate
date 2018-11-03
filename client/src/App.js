import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Homepage from 'containers/Homepage/Loadable';
import ScrollToTop from 'components/ScrollToTop';

export default function App() {
  return (
    <Fragment>
      <Helmet titleTemplate="%s - SaaS boilerplate" />
      <Router>
        <ScrollToTop>
          <Switch>
            <Route exact path="/" component={Homepage} />
          </Switch>
        </ScrollToTop>
      </Router>
    </Fragment>
  );
}
