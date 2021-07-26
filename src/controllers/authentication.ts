import { ITokens } from "../types";

const authService = require("../services/authService");
const UserModel = require("../models/user");

const MAX_AGE = 30 * 24 * 60 * 60 * 1000;

class Authentication {
  async register(req, res, _next) {
    try {
      const { email } = req.body;

      const candidate = await UserModel.findOne({ email });
      if (candidate)
        res
          .status(400)
          .json({ message: "User with such email already exists" });

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
      const { message } = e;
      console.error("ERROR: ", message);

      res.status(500).json({ message });
    }
  }

  async login(req, res, _next) {
    try {
      const { email } = req.body;
      const candidate = await UserModel.findOne({ email });
      if (!candidate)
        res.status(400).json({ message: "User with such email is not found" });

      const success = await authService.login(req.body);
      if (!success) res.status(400).json({ message: "Password is wrong" });

      res.json({ success });
    } catch (e) {
      const { message } = e;
      console.error("ERROR: ", message);

      res.status(500).json({ message });
    }
  }

  logout(req, res, _next) {
    try {
      res.json({ method: "logout" });
    } catch (e) {
      const { message } = e;
      console.error("ERROR: ", message);

      res.status(500).json({ message });
    }
  }

  activate(req, res, _next) {
    try {
      res.json({ method: "activate" });
    } catch (e) {
      const { message } = e;
      console.error("ERROR: ", message);

      res.status(500).json({ message });
    }
  }

  refresh(req, res, _next) {
    try {
      res.json({ method: "refresh" });
    } catch (e) {
      const { message } = e;
      console.error("ERROR: ", message);

      res.status(500).json({ message });
    }
  }
}

module.exports = new Authentication();
