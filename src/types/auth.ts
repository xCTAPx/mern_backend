export interface IRegisterData {
  email: string;
  password: string;
  nickname: string;
}

export interface ILoginData {
  email: string;
  password: string;
}

export interface ICreateTokensData {
  id: string;
  email: string;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export interface IUser {
  id: string;
  email: string;
  nickname: string;
  isActivated: boolean;
}
