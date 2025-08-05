const express = require("express");
const router = express.Router();
const produtoController = require("../controllers/produtoController");
const upload = require("../middleware/upmulter");

// Criar produto
router.post(
  "/cadastro",
  upload.single("imagem"),
  produtoController.createProduto
);

// Listar todos os produtos
router.get("/consulta", produtoController.getProdutos);

// Buscar um produto por ID
router.get("/consulta/:id", produtoController.getProdutoById);

// Atualizar produto
router.put(
  "/atualizar/:id",
  upload.single("imagem"),
  produtoController.updateProduto
);

// Deletar produto
router.delete("/deletar/:id", produtoController.deleteProduto);

module.exports = router;
