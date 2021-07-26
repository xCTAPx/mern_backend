export {}; // for avoiding ts-nodejs error (Cannot redeclare block-scoped variable ...)

module.exports = function (err, _req, res, _next) {
  console.error(err);

  const { message, errors } = err;
  if (err.custom) {
    return res.status(err.status).json({ message, errors });
  }
  return res.status(500).json({ message: `Unhandled error: ${message}` });
};
