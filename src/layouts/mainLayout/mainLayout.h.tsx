import useBoundStore from '@/store';
import { Auth } from 'aws-amplify';
import { BIOCARE_PORTAL_URL } from '../../aws/env';

const {
  VITE_AWS_DOMAIN: AWS_DOMAIN,
  VITE_AWS_USER_POOLS_WEB_CLIENT_ID: AWS_USER_POOLS_WEB_CLIENT_ID,
} = import.meta.env;

const refreshSession = (authUser, session) =>
  new Promise((resolve) => {
    authUser.refreshSession(session.refreshToken, (error) => {
      if (error) {
        resolve({
          isSuccess: false,
          error: error.message,
        });
      } else {
        resolve({ isSuccess: true });
      }
    });
  });

export const validateSession = async (authUser, session) => {
  try {
    const idTokenExpire = session.getIdToken().getExpiration();
    const currentTimeSeconds = Math.round(+new Date() / 1000);
    if (idTokenExpire <= currentTimeSeconds) {
      const refreshResult = await refreshSession(authUser, session);
      return refreshResult;
    }
    await Auth.currentSession();
    return { isSuccess: true };
  } catch (error) {
    return {
      isSuccess: false,
      error: error.message,
    };
  }
};

export const handleClearLocalStorage = () => {
  const usernameAccessToken = localStorage.getItem('usernameAccessToken');
  localStorage.clear();
  if (usernameAccessToken) {
    localStorage.setItem('usernameAccessToken', usernameAccessToken);
  }
};

export const handleSignOut = async (isGlobal = false) => {
  useBoundStore.getState().setLoading(true);
  handleClearLocalStorage();
  try {
    await Auth.signOut({ global: isGlobal });
  } catch (error) {
    console.log('🚀 ~ file: mainLayout.h.tsx:58 ~ handleSignOut ~ error:', error);
  }
  const urlRedirect = `https://${AWS_DOMAIN}/logout?client_id=${AWS_USER_POOLS_WEB_CLIENT_ID}&logout_uri=${BIOCARE_PORTAL_URL}`;
  window.location.href = urlRedirect;
  useBoundStore.getState().setLoading(false);
};

export const handleSignOutMobile = async (isGlobal = false) => {
  try {
    useBoundStore.getState().setLoading(true);
    handleClearLocalStorage();
    await Auth.signOut({ global: isGlobal });
    window.location.href = 'notificationapp://reset-password/fail';
  } catch (error) {
    useBoundStore.getState().setLoading(false);
  }
};
