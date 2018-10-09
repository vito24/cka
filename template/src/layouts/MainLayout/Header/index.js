import React, { Component, Fragment } from 'react';
import { Layout, Icon, Divider } from 'antd';
import logo from '../../../assets/logo.svg';

import styles from './index.less';

const { Header } = Layout;

export default class extends Component {
  render() {
    const { isMobile, collapsed, onCollapse } = this.props;
    return (
      <Header className={styles.header}>
        {isMobile && (
          <Fragment>
            <span className={styles.logo}>
              <img src={logo} alt="logo" width="64" height="64" />
            </span>
            <Divider type="vertical" key="line" />
          </Fragment>
        )}
        <Icon
          className={styles.trigger}
          type={isMobile !== collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={onCollapse}
        />
      </Header>
    );
  }
}
