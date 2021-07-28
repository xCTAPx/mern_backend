interface IApiError extends Error {
  status: number;
  custom: boolean;
  errors?: Error[];
}

class ApiError extends Error implements IApiError {
  status: number;
  custom: boolean;
  errors?: Error[];

  constructor(status, message, errors = [], custom = true) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.custom = custom;
  }

  static UnauthorizedError(): IApiError {
    return new ApiError(401, "User unauthorized");
  }

  static BadRequest(message: string, errors: Error[]): IApiError {
    return new ApiError(400, message, errors);
  }
}

module.exports = ApiError;
