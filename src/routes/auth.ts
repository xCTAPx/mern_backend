import { Router } from "express";
import { VALIDATORS } from "../validation";
import { authController } from "../controllers";
import { authMiddleware } from "../middlewares";

const router = Router();

const { emailValidator, passwordValidator, nicknameValidator } = VALIDATORS;

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

export const authRoute = router;
