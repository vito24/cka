import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import Logo from '../../assets/logo.svg';

import styles from './index.less';

@inject('store')
@observer
class Dashboard extends Component {
  render() {
    return (
      <div className={styles.app}>
        <img className={styles.logo} src={Logo} />
        <div>Hello, world!</div>
      </div>
    );
  }
}

export default Dashboard;
