import { AppFlowActions, ERROR_ACCESS_TOKEN } from '@/constants';
import emitter from '@/utils/emitter';
import {
  ApolloClient,
  ApolloLink,
  ErrorPolicy,
  FetchPolicy,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { message } from 'antd';
import { Auth } from 'aws-amplify';
import { isMobileOnly } from 'react-device-detect';

const errorLink = onError(({ graphQLErrors, networkError }) => {
  console.log('🚀 ~ file: index.tsx:10 ~ errorLink ~ networkError:', {
    graphQLErrors,
    networkError,
  });
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      const { message, extensions } = err;
      if (
        message.includes('403') ||
        message.includes('400') ||
        extensions.code === 'UNAUTHENTICATED'
      ) {
        emitter.emit(AppFlowActions.EXPIRE_TOKEN);
        return;
      }
    }
  }
  if (networkError?.message === ERROR_ACCESS_TOKEN) {
    emitter.emit(AppFlowActions.EXPIRE_TOKEN);
    return;
  }

  if (networkError) {
    message.error('Please check your network and try again');
  }
});

const authLink = setContext(async (operation, value) => {
  const { headers, isAuthorized = true, customAccessToken } = value || {};

  let accessToken = '';

  if (isAuthorized) {
    try {
      accessToken =
        customAccessToken || (await Auth.currentSession()).getAccessToken().getJwtToken();
    } catch (error) {
      console.log('🚀 ~ file: index.tsx:38 ~ authLink ~ error:', error);
      //Custom error message
      throw new Error(ERROR_ACCESS_TOKEN);
    }
  }

  const customHeaders = {
    ...headers,
    'access-token': accessToken,
  };

  return {
    headers: {
      ...customHeaders,
    },
  };
});

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_HOST_URL,
  credentials: 'same-origin',
});

const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache' as FetchPolicy,
    errorPolicy: 'ignore' as ErrorPolicy,
  },
  query: {
    fetchPolicy: 'no-cache' as FetchPolicy,
    errorPolicy: 'all' as ErrorPolicy,
  },
};

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  name: isMobileOnly ? 'biocare-portal-mobile' : 'biocare-portal-desktop',
  version: '0.1.0',
  defaultOptions,
  cache: new InMemoryCache({ addTypename: false }),
});

export default client;
