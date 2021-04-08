import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useGlobal } from '../state';

export function PublicRoute({ children, ...rest }: RouteProps) {
  const [state] = useGlobal();

  return (
    <Route
      {...rest}
      render={() =>
        state.isAuthorized ? (
          <Redirect
            to={{
              pathname: '/dashboard',
            }}
          />
        ) : (
          children
        )
      }
    />
  );
}
