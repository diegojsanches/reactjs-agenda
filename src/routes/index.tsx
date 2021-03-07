import React from 'react';
import { Route, Switch } from 'react-router-dom';

import SignRoute from './SignRoute';
import AuthRoute from './AuthRoute';

import Dashboard from '../pages/Dashboard';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

import Profile from '../pages/User';
import Contact from '../pages/Contact';

const Routes: React.FC = () => (
  <Switch>
    <SignRoute path="/signin" exact component={SignIn} />
    <SignRoute path="/signup" exact component={SignUp} />

    <Route path="/" exact component={Dashboard} />
    <AuthRoute path="/contact/:contactId" component={Contact} />
    <AuthRoute path="/contact" component={Contact} />
    <AuthRoute path="/perfil" component={Profile} /> 
  </Switch>
);

export default Routes;