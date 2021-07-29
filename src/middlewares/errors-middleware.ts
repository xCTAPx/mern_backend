import { Request, Response, NextFunction } from "express";
import { ApiError } from "../exceptions";

export const errorsMiddleware = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response<string, Record<string, string>> => {
  console.error(err);

  const { message, errors } = err;
  if (err instanceof ApiError) {
    const isErrors = Boolean(errors.length);
    const response = { message, errors: isErrors ? errors : undefined };

    return res.status(err.status).json(response);
  }
  return res.status(500).json({ message: `Unhandled error: ${message}` });
};
