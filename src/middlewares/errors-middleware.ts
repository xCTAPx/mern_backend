export {}; // for avoiding ts-nodejs error (Cannot redeclare block-scoped variable ...)

const ApiError = require("../exceptions/apiError");

module.exports = function (err, _req, res, _next) {
  console.error(err);

  if (err instanceof ApiError) {
    const { message, errors } = err;
    res.status(err.status).json({ message, errors });
  }
  res.status(500).json({ message: `Unhandled error: ${err.message}` });
};
