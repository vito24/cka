import React from 'react';
import ReactDOM from 'react-dom';
import { configure } from 'mobx';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import App from './router';
import './index.css';

configure({
  enforceActions: 'observed'
});

ReactDOM.render(
  <LocaleProvider locale={zhCN}>
    <App />
  </LocaleProvider>,
  document.getElementById('root')
);
