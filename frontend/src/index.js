import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
import Home from './pages/Home';
import User from './pages/User';
import Login from './pages/Login';
import PrivateRoute from './auth/PrivateRoute';
import VideoChat from './pages/VideoChat';

ReactDOM.render(
  <Router>
    <div>
      <Route exact path="/" component={Home} />
      <Route path="/login" component={Login} />
      <PrivateRoute path="/user" component={User} />
      <PrivateRoute path="/video" component={VideoChat} />
    </div>
  </Router>,
  document.getElementById('root')
);
