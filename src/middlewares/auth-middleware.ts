export {}; // for avoiding ts-nodejs error (Cannot redeclare block-scoped variable ...)

const ApiError = require("../exceptions/apiError");
const authService = require("../services/authService");

module.exports = async function (req, _res, next) {
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
