import { ITokens, IUser } from "../types";

const dotenv = require("dotenv");
const authService = require("../services/authService");

dotenv.config();

const MAX_AGE = 30 * 24 * 60 * 60 * 1000;

class Authentication {
  async register(req, res, next) {
    try {
      const { email } = req.body;

      const user = await authService.createUser(req.body);
      const tokens: ITokens = await authService.createTokens(
        req.body,
        user._id
      );

      res.cookie("refreshToken", tokens.refreshToken, {
        maxAge: MAX_AGE,
        httpOnly: true,
      });

      const { accessToken, refreshToken } = tokens;

      res.json({
        email,
        nickname: user.nickname,
        id: user._id,
        tokens: { accessToken, refreshToken },
      });
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const user: IUser = await authService.login(req.body);

      const tokens: ITokens = await authService.createTokens(req.body, user.id);

      res.cookie("refreshToken", tokens.refreshToken, {
        maxAge: MAX_AGE,
        httpOnly: true,
      });

      const { accessToken, refreshToken } = tokens;

      res.json({ user, tokens: { accessToken, refreshToken } });
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      await authService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.end();
    } catch (e) {
      next(e);
    }
  }

  async activate(req, res, next) {
    try {
      await authService.activate(req.params.link);
      res.redirect(process.env.CLIENT_URL);
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;

      await authService.verifyToken(refreshToken, "refresh");
      const user: IUser = await authService.refresh(refreshToken);

      const tokens: ITokens = await authService.createTokens(req.body, user.id);

      res.cookie("refreshToken", tokens.refreshToken, {
        maxAge: MAX_AGE,
        httpOnly: true,
      });
      res.json(user);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new Authentication();
