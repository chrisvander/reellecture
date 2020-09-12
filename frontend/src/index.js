import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
import App from './pages/App';
import User from './pages/User';

ReactDOM.render(
  <Router>
    <div>
      <Route exact path="/" component={App} />
      <Route path="/user" component={User} />
    </div>
  </Router>,
  document.getElementById('root')
);
