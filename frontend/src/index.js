import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
import Home from './pages/Home';
import User from './pages/User';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Register from './pages/Register'; 
import PrivateRoute from './auth/PrivateRoute';
import InstructorRoute from './auth/InstructorRoute';
import VideoChat from './pages/VideoChat';
import Analysis from './pages/Analysis'; 
import 'tachyons'; 

ReactDOM.render(
  <Router>
    <div>
      <Route path="/login" component={Login} />
      <Route path="/logout" component={Logout} />
      <Route path="/register" component={Register} />
      <PrivateRoute path="/user" component={User} />
      <InstructorRoute path="/analysis" component={Analysis} />
      <PrivateRoute path="/video/:roomID" component={VideoChat} />
    </div>
  </Router>,
  document.getElementById('root')
);

