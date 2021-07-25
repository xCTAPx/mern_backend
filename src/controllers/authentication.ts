import { ITokens } from "../types";

const bcrypt = require("bcrypt");
const authService = require("../services/auth-service");
const UserModel = require("../models/user");
const TokensModel = require("../models/tokens");

const MAX_AGE = 30 * 24 * 60 * 60 * 1000;

class Authentication {
  async register(req, res, _next) {
    try {
      const { email, password, nickname } = req.body;

      const hashPassword = await bcrypt.hash(password, 4);
      const candidate = await UserModel.findOne({ email });

      if (candidate) throw new Error("User with such email already exists");

      const user = new UserModel({ email, password: hashPassword, nickname });
      await user.save();

      const tokens: ITokens = authService.createTokens(req.body);

      const createdTokens = new TokensModel({ user: user._id, ...tokens });
      await createdTokens.save();

      res.cookie("refreshToken", tokens.refreshToken, {
        maxAge: MAX_AGE,
        httpOnly: true,
      });

      res.json({ email, nickname, id: user._id, tokens });
    } catch (e) {
      const { message } = e;
      console.error("ERROR: ", message);

      res.status(400).json({ message });
    }
  }

  login(req, res, _next) {
    try {
      res.json({ method: "login" });
    } catch (e) {
      const { message } = e;
      console.error("ERROR: ", message);

      res.status(400).json({ message });
    }
  }

  logout(req, res, _next) {
    try {
      res.json({ method: "logout" });
    } catch (e) {
      const { message } = e;
      console.error("ERROR: ", message);

      res.status(400).json({ message });
    }
  }

  activate(req, res, _next) {
    try {
      res.json({ method: "activate" });
    } catch (e) {
      const { message } = e;
      console.error("ERROR: ", message);

      res.status(400).json({ message });
    }
  }

  refresh(req, res, _next) {
    try {
      res.json({ method: "refresh" });
    } catch (e) {
      const { message } = e;
      console.error("ERROR: ", message);

      res.status(400).json({ message });
    }
  }
}

module.exports = new Authentication();
