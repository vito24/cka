import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import styles from './index.less';

@inject('store')
@observer
class Dashboard extends Component {
  render() {
    return (
      <div className={styles.app}>
        <div>Hello, world!</div>
      </div>
    );
  }
}

export default Dashboard;
