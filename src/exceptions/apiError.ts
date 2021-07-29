import { ValidationError } from "express-validator";

export class ApiError extends Error {
  status: number;
  errors?: Error[] | ValidationError[];

  constructor(
    status: number,
    message: string,
    errors: Error[] | ValidationError[] = []
  ) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError(): ApiError {
    return new ApiError(401, "User unauthorized");
  }

  static BadRequest(message: string, errors: Error[]): ApiError {
    return new ApiError(400, message, errors);
  }
}
