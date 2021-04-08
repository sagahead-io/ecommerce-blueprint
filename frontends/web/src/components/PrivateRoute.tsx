import React, { useEffect } from 'react';
import { Route, RouteProps } from 'react-router-dom';
import { useMeQuery } from '../gql/schema';
import Login from '../pages/Login';
import { useGlobal } from '../state';

export function PrivateRoute({ children, ...rest }: RouteProps) {
  const { data, loading, error } = useMeQuery();
  const [_, actions] = useGlobal();

  useEffect(() => {
    if (data?.me?.isAuthorized) {
      actions.setIsAuthorized(data?.me?.isAuthorized);
    }
    return () => {};
  }, [data]);

  if (loading) {
    return <>Loading</>;
  }

  if (error) {
    return <Login />;
  }

  return <Route {...rest} render={() => (data?.me?.isAuthorized ? children : <Login />)} />;
}
