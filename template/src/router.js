import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';
import Dashboard from './pages/Dashboard';

export default () => (
  <Router>
    <Switch>
      <Redirect exact from="/" to="dashboard" />
      <Route exact path="/dashboard" component={Dashboard} />
    </Switch>
  </Router>
);
