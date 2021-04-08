import React, { useEffect, useRef } from 'react';
import Auth0Lock from 'auth0-lock';
import { TOKENS } from '../../config/enums';
import { ROUTES } from '../../config/routes';
import { useHistory } from 'react-router-dom';
import { env } from '../../config/env';
import { useGlobal } from '../../state';
import { useLoginMutation } from '../../gql/schema';

export default function Login() {
  const { push } = useHistory();
  // eslint-disable-next-line
  const [_, actions] = useGlobal();
  const [loginMutation] = useLoginMutation();
  const mounted = useRef(true);
  const handler = useRef(handleLogin);
  
  const auth0 = new Auth0Lock(env.REACT_APP_AUTH0_CLIENT_ID, env.REACT_APP_AUTH0_DOMAIN, {
    closable: false,
    allowAutocomplete: true,
    allowedConnections: env.REACT_APP_AUTH0_CONNECTION.split(','),
    auth: {
      responseType: 'token',
      redirect: true,
      audience: env.REACT_APP_AUTH0_DEFAULT_AUDIENCE,
    },
  });

  useEffect(() => {
    if (mounted.current) {
      auth0.on('authenticated', handler.current);
      auth0.show();
    }
    return () => {
      mounted.current = false;
      auth0.hide();
    };
  // eslint-disable-next-line
  }, []);

  return <></>;

  async function handleLogin(res: AuthResult) {
    localStorage.setItem(TOKENS.accessToken, res.accessToken);
    try {
      const loginResult = await loginMutation({
        variables: { input: { accessToken: res.accessToken } },
      });
      console.log('login result', loginResult)
      if (loginResult.data?.login.loggedIn) {
        actions.setIsAuthorized(loginResult?.data?.login?.loggedIn, () => {
          auth0.hide();
          push(ROUTES.dashboard);
        });
      } else {
        throw new Error('User not logged in');
      }
    } catch (e) {
      console.log(e);
      push(ROUTES.login);
    }
  }
}
