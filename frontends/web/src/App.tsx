import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { PublicRoute } from './components/PublicRoute';
import { PrivateRoute } from './components/PrivateRoute';
import { ROUTES } from './config/routes';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login/Login';
import './App.css';

export default function App() {
  return (
    <Router>
      <Switch>
        <PrivateRoute path={'/'}>
          <Dashboard />
        </PrivateRoute>
        <PublicRoute path={ROUTES.login}>
          <Login />
        </PublicRoute>
      </Switch>
    </Router>
  );
}
