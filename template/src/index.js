import React from 'react';
import ReactDOM from 'react-dom';
import { configure } from 'mobx';
import App from './router';
import './index.css';

configure({
  enforceActions: 'observed'
});

ReactDOM.render(<App />, document.getElementById('root'));
