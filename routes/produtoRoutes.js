const express = require("express");
const router = express.Router();
const produtoController = require("../controllers/produtoController");

router.post("/cadastro", produtoController.createProduto);

router.get("/produtos", produtoController.getProdutos);

router.get("/cadastro/:id", produtoController.getProdutoById);

router.put("/cadastro/:id", produtoController.updateProduto);

router.delete("/cadastro/:id", produtoController.deleteProduto);

module.exports = router;
