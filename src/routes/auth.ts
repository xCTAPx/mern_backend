const { Router } = require("express");
const router = Router();
const authController = require("../controllers/authentication");

router.post("/registration", (req, res) => authController.register(req, res));

router.post("/login", (req, res) => authController.login(req, res));

router.post("/logout", (req, res) => authController.logout(req, res));

router.get("/activate/:link", (req, res) => authController.activate(req, res));

router.get("/refresh", (req, res) => authController.refresh(req, res));

module.exports = router;
