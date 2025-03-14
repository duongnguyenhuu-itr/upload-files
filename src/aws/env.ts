import _ from 'lodash';
import { awsConfigAlpha, awsConfigProd } from './aws-exports';

const {
  VITE_ENV: ENV,
  VITE_LINK_REDIRECT_AWS: LINK_REDIRECT_AWS,
  VITE_LINK_LOGOUT_AWS: LINK_LOGOUT_AWS,
  VITE_HOST_URL: HOST_URL,
  VITE_URL_GEOCODE: URL_GEOCODE,
  VITE_GOONG_API_KEY: GOONG_API_KEY,
} = import.meta.env;

export const ENV_ENUM = {
  alpha: 'alpha',
  delta: 'delta',
  staging: 'staging',
  customer: 'customer',
} as const;

export const BIOCARE_PORTAL_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:3001/'
    : ENV === ENV_ENUM.customer
    ? 'https://customer.biotricity.com/'
    : 'https://alpha.bioflux.io/';

const LINK_REDIRECT_AWS_LOCAL = 'http://localhost:3001/';

const LINK_LOGOUT_AWS_LOCAL = 'http://localhost:3001/';

const generateLinkAws = (url: string, type: string) => {
  if (_.includes(window.location.hostname, 'localhost')) {
    return type === 'redirect' ? LINK_REDIRECT_AWS_LOCAL : LINK_LOGOUT_AWS_LOCAL;
  }
  return url;
};

const generateAwsConfig = () =>
  ENV === ENV_ENUM.customer ? awsConfigProd : awsConfigAlpha;

const LINK_CONFIG = {
  LINK_REDIRECT_AWS: generateLinkAws(LINK_REDIRECT_AWS, 'redirect'),
  LINK_LOGOUT_AWS: generateLinkAws(LINK_LOGOUT_AWS, 'logout'),
  AWS_CONFIG: generateAwsConfig(),
  HOST_URL,
  URL_GEOCODE,
};

export default LINK_CONFIG;
