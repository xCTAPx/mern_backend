import { ICreateTokensData, ITokens } from "../types";

const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

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
  createTokens(data: ICreateTokensData): ITokens {
    const tokenData = JSON.stringify(data);

    const accessToken = createToken(tokenData, "access");
    const refreshToken = createToken(tokenData, "refresh");

    return { accessToken, refreshToken };
  }
}

module.exports = new AuthService();
