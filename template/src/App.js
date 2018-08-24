import React, { Component } from 'react';
import Logo from './assets/logo.svg';
import styles from './App.css';

class App extends Component {
  render() {
    return (
      <div className={styles.app}>
        <img className={styles.logo} src={Logo} />
        <div>Hello, world!</div>
      </div>
    );
  }
}

export default App;
