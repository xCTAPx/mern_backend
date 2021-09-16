import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { authService } from "../services";
import { ApiError } from "../exceptions";
import { ITokens } from "../types";

dotenv.config();

const MAX_AGE = 30 * 24 * 60 * 60 * 1000;

const validate = (req: Request): void => {
  const errors = validationResult(req);

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
      validate(req);

      const user = await authService.createUser(req.body);

      res.json(user);
    } catch (e) {
      next(e);
    }
  }

  async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      validate(req);

      const user = await authService.login(req.body);

      await authService.deleteTokensByUser(user.id);

      const tokens: ITokens =
        await authService.createTokens(req.body, user.id);

      res.cookie("refreshToken", tokens.refreshToken, {
        maxAge: MAX_AGE,
        httpOnly: true,
        sameSite: "none",
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

  async logout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { refreshToken } = req.cookies;
      await authService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.end();
    } catch (e) {
      next(e);
    }
  }

  async restore(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      validate(req);
      const { email } = req.body;

      await authService.restore(email);

      return res.end();
    } catch (e) {
      next(e);
    }
  }

  async createNewPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      validate(req);
      const { resetToken, password, passwordConfirmation } =
        req.body;

      await authService.createNewPassword(
        resetToken,
        password,
        passwordConfirmation
      );

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

      await authService.verifyToken(
        refreshToken,
        "refresh"
      );
      const user = await authService.refresh(refreshToken);

      const tokens: ITokens =
        await authService.createTokens(req.body, user.id);

      const { accessToken, refreshToken: newRefreshToken } =
        tokens;

      res.cookie("refreshToken", tokens.refreshToken, {
        maxAge: MAX_AGE,
        httpOnly: true,
        sameSite: "none",
      });
      res.json({
        accessToken,
        refreshToken: newRefreshToken,
      });
    } catch (e) {
      next(e);
    }
  }

  checkAccess(
    _req: Request,
    res: Response,
    next: NextFunction
  ): void {
    try {
      res.json({
        access: true,
      });
    } catch (e) {
      next(e);
    }
  }
}

export const authController = new Authentication();
