import { ITokens } from "../types";
const authService = require("../services/auth-service");
const User = require("../models/user");

class Authentication {
  async register(req, res, _next) {
    try {
      const { email, password, nickname } = req.body;

      if (!email)
        return res
          .status(400)
          .json({ message: "Email field is empty or uncorrect" });

      const user = new User({ email, password, nickname });
      await user.save();

      const tokens: ITokens = authService.createTokens(req.body);

      res.cookie("refreshToken", tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
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
    res.json({ method: "login" });
  }

  logout(req, res, _next) {
    res.json({ method: "logout" });
  }

  activate(req, res, _next) {
    res.json({ method: "activate" });
  }

  refresh(req, res, _next) {
    res.json({ method: "refresh" });
  }
}

module.exports = new Authentication();
