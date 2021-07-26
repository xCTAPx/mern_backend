import {
  ICreateTokensData,
  ILoginData,
  IRegisterData,
  ITokens,
} from "../types";

const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../models/user");
const TokensModel = require("../models/tokens");

dotenv.config();

type TokenType = "access" | "refresh";

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

    const hashPassword = await bcrypt.hash(password, 4);

    const user = new UserModel({ email, password: hashPassword, nickname });
    await user.save();

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

  async login(data: ILoginData): Promise<boolean> {
    const { email, password } = data;
    const candidate = await UserModel.findOne({ email });

    const equalPassword = await bcrypt.compare(password, candidate.password);

    return equalPassword;
  }
}

module.exports = new AuthService();
