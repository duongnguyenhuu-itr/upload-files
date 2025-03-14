import { message } from 'antd';
import axios, { AxiosError, AxiosInstance } from 'axios';
import queryString from 'query-string';

const buildAxiosInstance = (options?: {
  baseURL?: string;
  getToken?: () => string | null;
}): AxiosInstance => {
  const { baseURL } = options ?? {};

  const axiosClient = axios.create({
    baseURL,
    headers: {
      'content-type': 'application/json',
    },
    paramsSerializer: (params) => queryString.stringify(params),
  });

  // axiosClient.interceptors.request.use(async (config) => {
  //   const token = options?.getToken && options.getToken();
  //   if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  //   return config;
  // });

  axiosClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.code === 'ERR_NETWORK') {
        message.error('Please check your network and try again');
        return;
      }
      throw error;
    },
  );
  return axiosClient;
};

class Http {
  instance: AxiosInstance;
  constructor() {
    this.instance = buildAxiosInstance({
      baseURL: import.meta.env.VITE_RESTFUL_ENDPOINT,
    });
  }
}

const http = new Http().instance;

export default http;
