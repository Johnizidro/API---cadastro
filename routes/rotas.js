const express = require("express");
const router = express.Router();
const authController = require("../controllers/controles");

router.post("/registrar", authController.registrar);
router.post("/login", authController.login);

module.exports = router;