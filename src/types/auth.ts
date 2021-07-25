export interface IRegisterData {
  mail: string;
  password: string;
  nickname: string;
}

export interface ILoginData {
  mail: string;
  password: string;
}

export interface ICreateTokensData {
  id: string;
  mail: string;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}
