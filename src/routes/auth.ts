const { Router } = require("express");
const router = Router();
const authController = require("../controllers/authentication");

router.post("/create", (req, res) => {
  authController.create(req, res);
});

module.exports = router;
