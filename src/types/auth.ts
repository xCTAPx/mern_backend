export interface IRegisterData {
  email: string;
  password: string;
  passwordConfirmation: string;
  nickname: string;
}

export interface ILoginData {
  email: string;
  password: string;
  isActivated: boolean;
}

export interface ICreateTokensData {
  password: string;
  nickname: string;
  email: string;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export type UserClient = Omit<
  IRegisterData,
  "password" | "passwordConfirmation"
> & { id: string };
