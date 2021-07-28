import { body } from "express-validator";

const passwordRegExp = /^[a-zA-Z0-9!@#$%^&*)(+=._-]+$/g;

export default {
  emailValidator: body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Incorrect email format"),
  nicknameValidator: body("nickname")
    .isLength({ min: 5 })
    .withMessage("Nickname must be at least 5 chars long"),
  passwordValidator: body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 chars long")
    .custom((value: string) => value.match(passwordRegExp))
    .withMessage(
      "Password must include spec symbols, latin characters or numbers only"
    ),
};
