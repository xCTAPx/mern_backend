export {}; // for avoiding ts-nodejs error (Cannot redeclare block-scoped variable ...)

const { body } = require("express-validator");

module.exports = {
  emailValidator: body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Incorrect email format"),
  nicknameValidator: body("nickname")
    .isLength({ min: 5 })
    .withMessage("Nickname must be at least 5 chars long"),
  passwordValidator: body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 chars long"),
};
