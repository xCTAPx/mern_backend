import { ITokens } from "../types";

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
      const success = await authService.login(req.body);

      res.json({ success });
    } catch (e) {
      next(e);
    }
  }

  logout(req, res, next) {
    try {
      res.json({ method: "logout" });
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

  refresh(req, res, next) {
    try {
      res.json({ method: "refresh" });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new Authentication();
