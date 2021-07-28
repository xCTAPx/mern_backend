const { Router } = require("express");
const {
  emailValidator,
  passwordValidator,
  nicknameValidator,
} = require("../validation/authValidatiors");
const router = Router();
const authController = require("../controllers/authentication");
const authMiddleware = require("../middlewares/auth-middleware");

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

module.exports = router;
