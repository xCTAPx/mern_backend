import { body } from "express-validator";

const passwordRegExp = /^[a-zA-Z0-9!@#$%^&*)(+=._-]+$/g;

export const VALIDATORS = {
  emailValidator: body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Incorrect email format"),
  nicknameValidator: body("nickname")
    .isLength({ min: 5, max: 20 })
    .withMessage("Nickname must be at least 5 and max 20 chars long"),
  passwordValidator: body("password")
    .isLength({ min: 8, max: 32 })
    .withMessage("Password must be at least 8 and max 32 chars long")
    .custom((value: string) => value.match(passwordRegExp))
    .withMessage(
      "Password must include spec symbols, latin characters or numbers only"
    ),
};
