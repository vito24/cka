import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import App from './pages/App';

export default () => (
  <HashRouter>
    <div>
      <Route exact path="/" component={App} />
      <Route path="/home" component={App} />
    </div>
  </HashRouter>
);
