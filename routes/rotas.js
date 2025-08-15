const express = require("express");
const router = express.Router();
const authController = require("../controllers/controles");

router.post("/registrar", authController.registrar);
router.post("/login", authController.login);
router.post("/esqueci-senha", authController.solicitarResetSenha);
router.post("/resetar-senha/:token", authController.resetarSenha);



module.exports = router;