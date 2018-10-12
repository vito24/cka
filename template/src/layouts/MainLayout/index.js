import React, { Component } from 'react';
import { Layout } from 'antd';
import DrawerMenu from 'rc-drawer';
import { ContainerQuery } from 'react-container-query';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import classNames from 'classnames';
import Sider from './Sider';
import Header from './Header';

import 'rc-drawer/assets/index.css';
import styles from './index.module.less';

const { Content, Footer } = Layout;

const query = {
  'screen-xs': {
    maxWidth: 575
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599
  },
  'screen-xxl': {
    minWidth: 1600
  }
};

export default class extends Component {
  state = {
    collapsed: false,
    isMobile: false
  };

  componentDidMount() {
    this.enquireHandler = enquireScreen((mobile = false) => {
      this.setState({
        isMobile: mobile
      });
    });
  }

  componentWillUnmount() {
    unenquireScreen(this.enquireHandler);
  }

  onToggleCollapase = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  render() {
    const { collapsed, isMobile } = this.state;
    const { children } = this.props;
    const layout = (
      <Layout>
        {isMobile ? (
          <DrawerMenu
            getContainer={null}
            level={null}
            handler={false}
            open={collapsed}
            onHandleClick={this.onToggleCollapase}
            onMaskClick={this.onToggleCollapase}
          >
            <Sider isMobile={true} collapsed={false} onCollapse={this.onToggleCollapase} />
          </DrawerMenu>
        ) : (
          <Sider isMobile={false} collapsed={collapsed} onCollapse={this.onToggleCollapase} />
        )}

        <Layout style={{ minHeight: '100vh', marginLeft: isMobile ? 0 : collapsed ? 80 : 230 }}>
          <Header isMobile={isMobile} collapsed={collapsed} onCollapse={this.onToggleCollapase} />
          <Content className={styles.content}>{children}</Content>
          <Footer style={{ textAlign: 'center' }}>Copyright © 2018 vito24</Footer>
        </Layout>
      </Layout>
    );

    return (
      <ContainerQuery query={query}>
        {params => <div className={classNames(params)}>{layout}</div>}
      </ContainerQuery>
    );
  }
}
