import React, { Component } from 'react';
import Logo from '../../assets/logo.svg';
import styles from './index.less';

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
