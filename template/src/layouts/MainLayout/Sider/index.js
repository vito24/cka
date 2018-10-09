import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';
import menus from '../../../menu';

import logo from '../../../assets/logo.png';
import styles from './index.less';

const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

export default class extends Component {
  getMenus = menuData => {
    if (!menuData) {
      return [];
    }
    return menuData.map(({ children, icon, path, name }) => {
      if (children && children.length > 0) {
        // subMenu
        const subMenus = this.getMenus(children);
        if (subMenus && subMenus.length > 0) {
          return (
            <SubMenu
              title={
                <span>
                  {icon && <Icon type={icon} />}
                  <span>{name}</span>
                </span>
              }
              key={path}
            >
              {subMenus}
            </SubMenu>
          );
        }
        return null;
      } else {
        return (
          <Menu.Item key={path}>
            <Link to={path}>
              {icon && <Icon type={icon} />}
              <span>{name}</span>
            </Link>
          </Menu.Item>
        );
      }
    });
  };

  render() {
    const { isMobile, ...restProps } = this.props;

    return (
      <Sider
        className={styles[isMobile ? 'collapsedSider' : 'sider']}
        width={230}
        trigger={null}
        collapsible
        breakpoint="lg"
        {...restProps}
      >
        <div className={styles.logo}>
          <img src={logo} alt="logo" height="40" />
          <span className={styles.name}>CKA</span>
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          {this.getMenus(menus)}
        </Menu>
      </Sider>
    );
  }
}
