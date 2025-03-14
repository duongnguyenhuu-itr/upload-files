export interface IInitAuthPayload {
  clientId: string;
  username: string;
  password: string;
}

export interface ISignInPayload {
  clientId: string;
  redirectUri: string;
  state: string;
  username?: string;
  password?: string;
  authenticationToken?: string;
}

export interface IInitAuthResponse {
  challengeName?: string;
  authenticationToken: string;
  sessionToken: string;
  user: {
    sub?: string;
    email_verified?: string;
    preferred_username?: string;
    email?: string;
    username: string;
  };
}

export interface ISignInResponse {
  challengeName?: string;
  sessionToken: string;
  callbackUri?: string;
  user: {
    sub?: string;
    email_verified?: string;
    preferred_username?: string;
    email?: string;
    username: string;
  };
}

export interface IConfirmNewPasswordPayload {
  clientId: string;
  sessionToken: string;
  username: string;
  newPassword: string;
}

export interface IChangePasswordPayload {
  clientId: string;
  sessionToken: string;
  username: string;
  previousPassword: string;
  proposedPassword: string;
}

export interface IChangePasswordResponse {
  message?: string;
}

export interface IUpdateEmailPayload {
  clientId: string;
  sessionToken: string;
  username: string;
  proposedEmail: string;
}

export interface ISetUpNewPasswordResponse {
  authenticationToken: string;
  user: {
    sub?: string;
    email_verified?: string;
    given_name?: string;
    family_name: string;
    ['custom:userId']?: string;
    username: string;
  };
}

export interface IGetAuthorizedUserPayload {
  clientId: string;
  username: string;
  sessionToken: string;
}

export interface IGetAuthorizedUserResponse {
  ['custom:userId']?: string;
  email: string;
  email_verified: string;
  family_name: string;
  given_name: string;
  sub: string;
  username: string;
  message?: string;
  name?: string;
}
