export {}; // for avoiding ts-nodejs error (Cannot redeclare block-scoped variable ...)

import {
  ICreateTokensData,
  ILoginData,
  IRegisterData,
  ITokens,
  IUser,
} from "../types";

const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const UserModel = require("../models/user");
const TokensModel = require("../models/tokens");
const ApiError = require("../exceptions/apiError");
const mailService = require("../services/mailService");

dotenv.config();

type TokenType = "access" | "refresh";

const { v4 } = uuid;

const JwtSecretAccess = process.env.ACCESS_TOKEN_SECRET;
const JwtSecretRefresh = process.env.REFRESH_TOKEN_SECRET;

const createToken = (id: string, type: TokenType): string => {
  const accessToken = type === "access";
  const secret = accessToken ? JwtSecretAccess : JwtSecretRefresh;

  return jwt.sign({ data: id }, secret, {
    expiresIn: accessToken ? "1h" : "30d",
  });
};

class AuthService {
  async createUser(userData: IRegisterData): Promise<IRegisterData> {
    const { email, password, nickname } = userData;

    const candidate = await UserModel.findOne({ email });
    if (candidate)
      throw ApiError.BadRequest("User with such email already exists");

    const hashPassword = await bcrypt.hash(password, 4);

    const user = new UserModel({
      email,
      password: hashPassword,
      nickname,
      activationLink: v4(),
    });

    await user.save();

    await mailService.sendActivationLink(
      email,
      `${process.env.SERVER_URL}/api/auth/activate/${user.activationLink}`
    );

    return user;
  }

  async createTokens(
    data: ICreateTokensData,
    userId: string
  ): Promise<ITokens> {
    const tokenData = JSON.stringify(data);

    const accessToken = createToken(tokenData, "access");
    const refreshToken = createToken(tokenData, "refresh");

    const createdTokens = new TokensModel({
      user: userId,
      accessToken,
      refreshToken,
    });
    await createdTokens.save();

    return createdTokens;
  }

  async deleteTokensByUser(userId: string): Promise<void> {
    await TokensModel.deleteMany({ user: userId });
  }

  async activate(activationLink: string): Promise<void> {
    const user = await UserModel.findOne({ activationLink });
    if (!user) throw ApiError.BadRequest("User is not found");
    user.isActivated = true;

    await user.save();
  }

  async login(data: ILoginData): Promise<IUser> {
    const { email, password } = data;
    const candidate = await UserModel.findOne({ email });
    if (!candidate)
      throw ApiError.BadRequest("User with such email is not found");

    const equalPassword = await bcrypt.compare(password, candidate.password);

    if (!equalPassword) throw ApiError.BadRequest("Password is wrong");

    return {
      id: candidate._id,
      email,
      nickname: candidate.nickname,
      isActivated: candidate.isActivated,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    const token = await TokensModel.findOne({ refreshToken });

    if (!token) throw ApiError.BadRequest("User is not authorized");

    await TokensModel.deleteOne({ refreshToken });
  }

  async verifyToken(token: string, type: TokenType): Promise<void> {
    try {
      const secret =
        type === "access"
          ? process.env.ACCESS_TOKEN_SECRET
          : process.env.REFRESH_TOKEN_SECRET;

      await jwt.verify(token, secret);
    } catch (e) {
      throw ApiError.UnauthorizedError();
    }
  }

  async refresh(refreshToken: string): Promise<IUser> {
    const tokens = await TokensModel.findOne({ refreshToken });
    const user = await UserModel.findById(tokens.user);
    await TokensModel.deleteOne({ refreshToken });

    return user;
  }
}

module.exports = new AuthService();
