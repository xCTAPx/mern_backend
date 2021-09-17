declare interface IRegisterData {
  email: string;
  password: string;
  passwordConfirmation: string;
  nickname: string;
}

declare interface ILoginData {
  email: string;
  password: string;
  isActivated: boolean;
}

declare interface ICreateTokensData {
  password: string;
  nickname: string;
  email: string;
}

declare interface ITokens {
  accessToken: string;
  refreshToken: string;
}

declare type UserClient = Omit<
  IRegisterData,
  "password" | "passwordConfirmation"
> & { id: string };
