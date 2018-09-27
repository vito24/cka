import React, { Component } from 'react';
import { observer, Provider } from 'mobx-react';
import Dashboard from './Dashboard';
import Store from './Store';

@observer
export default class extends Component {
  constructor(props) {
    super(props);
    this.store = new Store();
  }

  render() {
    return (
      <Provider store={this.store}>
        <Dashboard />
      </Provider>
    );
  }
}
