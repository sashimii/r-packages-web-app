import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import './index.scss';
import './scss/global.scss';

import { Provider } from 'react-redux';
import store from './redux/store';
import { Routes } from './Routes';

const app = () => {
  ReactDOM.render(
    <Provider store={store}>
      <Router>
        <Routes />
      </Router>
    </Provider>,
    document.getElementById('app-container'),
  );
};

app();