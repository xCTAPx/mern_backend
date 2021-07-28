import { Router } from "express";
import validators from "../validation/authValidatiors";
import authController from "../controllers/authentication";
import authMiddleware from "../middlewares/auth-middleware";

const router = Router();

const { emailValidator, passwordValidator, nicknameValidator } = validators;

router.post(
  "/registration",
  emailValidator,
  passwordValidator,
  nicknameValidator,
  authController.register
);

router.post("/login", emailValidator, passwordValidator, authController.login);

router.post("/logout", authController.logout);

router.get("/activate/:link", authController.activate);

router.get("/refresh", authController.refresh);

router.get("/checkAccess", authMiddleware, authController.checkAccess); // route for checking authorization functionality

export default router;
