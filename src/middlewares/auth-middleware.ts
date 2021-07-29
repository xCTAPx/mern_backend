import { Request, Response, NextFunction } from "express";
import { ApiError } from "../exceptions";
import { authService } from "../services";

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<NextFunction | void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) return next(ApiError.UnauthorizedError());

    const token = authHeader.split(" ")[1];

    if (!token) return next(ApiError.UnauthorizedError());

    await authService.verifyToken(token, "access");
    next();
  } catch (e) {
    return next(ApiError.UnauthorizedError());
  }
};
