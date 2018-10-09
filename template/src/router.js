import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Page404 from './pages/Page404';

export default () => (
  <Router>
    <MainLayout>
      <Switch>
        <Redirect exact from="/" to="dashboard" />
        <Route exact path="/dashboard" component={Dashboard} />
        <Route component={Page404} />
      </Switch>
    </MainLayout>
  </Router>
);
