import React from 'react';
import { Router, Switch, Route } from 'react-router';
import { createBrowserHistory } from 'history';

import Home from './views/Home';
import Add from './views/Add';
import Tool from './views/Tool';
import Filters from './views/Filters';
import LoginComponent from './views/LoginComponent';
import Logout from './views/Logout';
import Tutorial from './views/Tutorial';
import Register from './views/Register';
import UserOffers from './views/UserOffers';

const browserHistory = createBrowserHistory();

export default () => (
  <Router history={browserHistory}>
    <Switch>
      <Route exact path="/" component={Home}/>
      <Route exact path="/tool/:id" component={Tool}/>
      <Route exact path="/add" component={Add}/>
      <Route exact path="/filters" component={Filters}/>
      <Route exact path="/login" component={LoginComponent}/>
      <Route exact path="/logout" component={Logout}/>
      <Route exact path="/register" component={Register}/>
      <Route exact path="/tutorial" component={Tutorial}/>
      <Route exact path="/user" component={UserOffers}/>
      <Route component={Home}/>
    </Switch>
  </Router>
);