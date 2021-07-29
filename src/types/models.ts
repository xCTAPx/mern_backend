import mongoose from "mongoose";

export type UserModelType = mongoose.Document & {
  email: string;
  password: string;
  nickname: string;
  isActivated: boolean;
  activationLink?: string;
};

export type TokensModelType = mongoose.Document & {
  accessToken: string;
  refreshToken: string;
  user: string;
};
