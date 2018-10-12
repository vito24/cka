import React, { Component, Fragment } from 'react';
import { Layout, Icon, Dropdown, Menu, Avatar, message, Divider } from 'antd';
import logo from '../../../assets/logo.svg';
import avatar from '../../../assets/avatar.png';

import styles from './index.module.less';

const { Header } = Layout;

export default class extends Component {
  onClickMenu = ({ key }) => {
    if (key === 'logout') {
      message.success('Successfully logged out!');
    }
  };

  render() {
    const { isMobile, collapsed, onCollapse } = this.props;

    const menu = (
      <Menu onClick={this.onClickMenu}>
        <Menu.Item disabled>
          <Icon type="setting" />设置
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />退出登录
        </Menu.Item>
      </Menu>
    );

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
        <div className={styles.rightHeader}>
          <Dropdown overlay={menu}>
            <span className={styles.action}>
              <Avatar size="small" className={styles.avatar} src={avatar} />
              <span>vito</span>
            </span>
          </Dropdown>
        </div>
      </Header>
    );
  }
}
