import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { UserModel, TokensModel } from "../models";
import { ApiError } from "../exceptions";
import { mailService } from "../services";
import { UserDto } from "../dtos";

dotenv.config();

type TokenType = "access" | "refresh";

const RESET_TOKEN_EXPIRATION_TIME = 3600 * 1000;

const JwtSecretAccess = process.env.ACCESS_TOKEN_SECRET;
const JwtSecretRefresh = process.env.REFRESH_TOKEN_SECRET;

const createToken = (
  data: string,
  type: TokenType
): string => {
  const accessToken = type === "access";
  const secret = accessToken
    ? JwtSecretAccess
    : JwtSecretRefresh;

  return jwt.sign({ data }, secret, {
    expiresIn: accessToken ? "1h" : "30d",
  });
};

class AuthService {
  async createUser(
    userData: IRegisterData
  ): Promise<UserDto> {
    const {
      email,
      password,
      passwordConfirmation,
      nickname,
    } = userData;

    const candidate = await UserModel.findOne({ email });
    if (candidate)
      throw ApiError.BadRequest(
        "User with such email already exists",
        []
      );

    if (passwordConfirmation !== password)
      throw ApiError.BadRequest(
        "Password confirmation is wrong",
        []
      );

    const hashPassword = await bcrypt.hash(password, 4);

    const activationLink = v4();

    const user = new UserModel({
      email,
      password: hashPassword,
      nickname,
      activationLink,
    });

    await mailService.sendActivationLink(
      email,
      `${process.env.API_URL}/api/auth/activate/${activationLink}`
    );

    await user.save();

    return new UserDto(user);
  }

  async createTokens(
    data: ICreateTokensData,
    userId: string
  ): Promise<ITokens> {
    const { email, nickname } = data;
    const userInfo = { userId, email, nickname };
    const tokenData = JSON.stringify(userInfo);

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
    const user = await UserModel.findOne({
      activationLink,
    });
    if (!user)
      throw ApiError.BadRequest("User is not found", []);
    user.isActivated = true;

    await user.save();
  }

  async login(data: ILoginData): Promise<UserDto> {
    const { email, password } = data;
    const candidate = await UserModel.findOne({ email });
    if (!candidate)
      throw ApiError.BadRequest(
        "User with such email is not found",
        []
      );

    if (!candidate.isActivated)
      throw ApiError.BadRequest(
        "Account is not activated",
        []
      );

    const equalPassword = await bcrypt.compare(
      password,
      candidate.password
    );

    if (!equalPassword)
      throw ApiError.BadRequest("Password is wrong", []);

    return new UserDto(candidate);
  }

  async logout(refreshToken: string): Promise<void> {
    const token = await TokensModel.findOne({
      refreshToken,
    });

    if (!token) throw ApiError.UnauthorizedError();

    await TokensModel.deleteOne({ refreshToken });
  }

  async restore(email: string): Promise<void> {
    const user = await UserModel.findOne({ email });

    if (!user)
      throw ApiError.BadRequest("User is not found", []);

    const generatedToken = await bcrypt.hash(
      `${email}${process.env.REFRESH_TOKEN_SECRET}`,
      4
    );

    const resetToken = generatedToken.replace(/\//g, "");

    user.resetToken = resetToken;
    user.resetTokenExpiration =
      Date.now() + RESET_TOKEN_EXPIRATION_TIME;

    await user.save();

    await mailService.sendResetPasswordLink(
      email,
      `${process.env.CLIENT_URL}/restore/${resetToken}`
    );
  }

  async createNewPassword(
    token: string,
    password: string,
    passwordConfirmation: string
  ): Promise<void> {
    const user = await UserModel.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user)
      throw ApiError.BadRequest(
        "User is not found or reset token has been exired",
        []
      );

    if (password !== passwordConfirmation)
      throw ApiError.BadRequest(
        "Password confirmation is wrong",
        []
      );

    const hashPassword = await bcrypt.hash(password, 4);

    user.password = hashPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;

    await user.save();
  }

  async verifyToken(
    token: string,
    type: TokenType
  ): Promise<void> {
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

  async refresh(
    refreshToken: string
  ): Promise<UserModelType> {
    const tokens = await TokensModel.findOne({
      refreshToken,
    });
    const user = await UserModel.findById(tokens.user);
    await TokensModel.deleteOne({ refreshToken });

    return user;
  }
}

export const authService = new AuthService();
