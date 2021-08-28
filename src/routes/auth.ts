import { Router } from "express";
import swaggerUI from "swagger-ui-express";
import swaggerDocument from "../docs/swagger.json";
import { VALIDATORS } from "../validation";
import { authController } from "../controllers";
import { authMiddleware } from "../middlewares";

const router = Router();

const { emailValidator, passwordValidator, nicknameValidator } = VALIDATORS;

router.use("/api-docs", swaggerUI.serve);

router.get("/api-docs", swaggerUI.setup(swaggerDocument, { explorer: true }));

router.post(
  "/registration",
  emailValidator,
  passwordValidator,
  nicknameValidator,
  authController.register
);

router.post("/login", emailValidator, passwordValidator, authController.login);

router.post("/logout", authController.logout);

router.post("/restore", emailValidator, authController.restore);

router.put(
  "/createNewPassword",
  passwordValidator,
  authController.createNewPassword
);

router.get("/activate/:link", authController.activate);

router.get("/refresh", authController.refresh);

router.get("/checkAccess", authMiddleware, authController.checkAccess); // route for checking authorization functionality

export const authRoute = router;
