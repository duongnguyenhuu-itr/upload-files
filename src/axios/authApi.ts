import http from '@/axios/axiosClient';
import {
  IChangePasswordPayload,
  IChangePasswordResponse,
  IConfirmNewPasswordPayload,
  ISignInPayload,
  ISignInResponse,
  IInitAuthResponse,
  IInitAuthPayload,
  IGetAuthorizedUserPayload,
  IGetAuthorizedUserResponse,
} from './authApi.d';

const initAuth = (payload: IInitAuthPayload) =>
  http.post<IInitAuthResponse>('/auth/initAuth', payload);

const signIn = (payload: ISignInPayload) =>
  http.post<ISignInResponse>('/auth/signin', payload);

const setUpNewPassword = (payload: IConfirmNewPasswordPayload) =>
  http.post('/auth/confirmNewPassword', payload);

const changePassword = (payload: IChangePasswordPayload) =>
  http.post<IChangePasswordResponse>('/auth/changePassword', payload);

const getAuthorizedUser = (payload: IGetAuthorizedUserPayload) =>
  http.post<IGetAuthorizedUserResponse>('/auth/getAuthorizedUser', payload);

export { changePassword, initAuth, setUpNewPassword, signIn, getAuthorizedUser };
