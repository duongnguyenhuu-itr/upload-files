import LINK_CONFIG from './env';
import _ from 'lodash';
const updatedAwsConfig = () => ({
  ...LINK_CONFIG.AWS_CONFIG,
  oauth: {
    ...LINK_CONFIG.AWS_CONFIG.oauth,
    redirectSignIn: LINK_CONFIG.LINK_REDIRECT_AWS,
    redirectSignOut: LINK_CONFIG.LINK_REDIRECT_AWS,
  },
  Auth: {
    ...LINK_CONFIG.AWS_CONFIG,
    cookieStorage: {
      domain:
        window.location.hostname === 'localhost'
          ? 'localhost'
          : import.meta.env.VITE_ENV_DOMAIN,
      path: '/',
      expires: 365,
      sameSite: 'strict',
      secure: !_.includes(window.location.hostname, 'localhost'),
    },
  },
});

export default updatedAwsConfig;
