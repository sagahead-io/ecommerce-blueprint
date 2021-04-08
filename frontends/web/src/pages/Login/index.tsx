import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Login from './Login';
import { ROUTES } from '../../config/routes';

export default function LoginContainer() {
  return (
    <>
      <Switch>
        <Route path={ROUTES.login}>
          <Login />
        </Route>
        <Redirect to={ROUTES.login} />
      </Switch>
    </>
  );
}
