import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { validationResult } from "express-validator";
import { ITokens } from "../types";
import authService from "../services/authService";
import ApiError from "../exceptions/apiError";

dotenv.config();

const MAX_AGE = 30 * 24 * 60 * 60 * 1000;

const validateEmail = (req: Request): void => {
  const errors = validationResult(req);
  console.log("ERRORS:", errors.isEmpty());
  if (!errors.isEmpty()) {
    throw ApiError.BadRequest(errors.array()[0].msg, []);
  }
};

class Authentication {
  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log("TRY");
      validateEmail(req);

      const user = await authService.createUser(req.body);
      const tokens: ITokens = await authService.createTokens(req.body, user.id);

      res.cookie("refreshToken", tokens.refreshToken, {
        maxAge: MAX_AGE,
        httpOnly: true,
      });

      const { accessToken, refreshToken } = tokens;

      res.json({
        user,
        tokens: { accessToken, refreshToken },
      });
    } catch (e) {
      next(e);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      validateEmail(req);

      const user = await authService.login(req.body);

      await authService.deleteTokensByUser(user.id);

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

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.cookies;
      await authService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.end();
    } catch (e) {
      next(e);
    }
  }

  async activate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await authService.activate(req.params.link);
      res.redirect(process.env.CLIENT_URL);
    } catch (e) {
      next(e);
    }
  }

  async refresh(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { refreshToken } = req.cookies;

      await authService.verifyToken(refreshToken, "refresh");
      const user = await authService.refresh(refreshToken);

      const tokens: ITokens = await authService.createTokens(req.body, user.id);

      const { accessToken, refreshToken: newRefreshToken } = tokens;

      res.cookie("refreshToken", tokens.refreshToken, {
        maxAge: MAX_AGE,
        httpOnly: true,
      });
      res.json({
        accessToken,
        refreshToken: newRefreshToken,
      });
    } catch (e) {
      next(e);
    }
  }

  checkAccess(_req: Request, res: Response, next: NextFunction): void {
    try {
      res.json({
        access: true,
        env_test: process.env.ENV_VARS_TEST || false,
      });
    } catch (e) {
      next(e);
    }
  }
}

export default new Authentication();
