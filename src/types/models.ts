import mongoose from "mongoose";

export type UserModel = mongoose.Document & {
  email: string;
  password: string;
  nickname: string;
  isActivated: boolean;
  activationLink?: string;
};

export type TokensModel = mongoose.Document & {
  accessToken: string;
  refreshToken: string;
  user: string;
};
