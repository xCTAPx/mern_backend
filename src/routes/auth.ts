const { Router } = require("express");
const router = Router();
const authController = require("../controllers/authentication");

router.post("/registration", authController.register);

router.post("/login", authController.login);

router.post("/logout", authController.logout);

router.get("/activate/:link", authController.activate);

router.get("/refresh", authController.refresh);

module.exports = router;
