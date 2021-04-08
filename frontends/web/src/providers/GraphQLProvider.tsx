import React, { ReactChild } from 'react';
import { ApolloClient, ApolloProvider, GraphQLRequest, InMemoryCache, from } from '@apollo/client';
import { HttpLink } from '@apollo/client/link/http';
import { RetryLink } from '@apollo/client/link/retry';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { env } from '../config/env';
import { TOKENS } from '../config/enums';

const httpLink = new HttpLink({ uri: env.REACT_APP_BACKEND_URL });

const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: Infinity,
    jitter: true,
  },
  attempts: {
    max: 5,
    retryIf: (error, _operation) => {
      console.log(error, 'Retrying...');
      return !!error;
    },
  },
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log('graphqlErrors', graphQLErrors);
    localStorage.clear();
  }

  if (networkError) {
    console.log('networkErrors', networkError);
  }

  return undefined;
});

const authMiddleware = setContext((req: GraphQLRequest, { headers }) => {
  let token = localStorage.getItem(TOKENS.accessToken);
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token.replace(/"/g, '')}` : '',
    },
  };
});

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([retryLink, authMiddleware, errorLink, httpLink]),
});

interface OwnProps {
  children: ReactChild[] | ReactChild;
}

export function GraphQLProvider({ children }: OwnProps) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
