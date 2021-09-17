type MongooseDocument = import("mongoose").Document;

declare type UserModelType = MongooseDocument & {
  email: string;
  password: string;
  nickname: string;
  isActivated: boolean;
  activationLink?: string;
  resetToken?: string;
  resetTokenExpiration?: number;
};

declare type TokensModelType = MongooseDocument & {
  accessToken: string;
  refreshToken: string;
  user: string;
};
