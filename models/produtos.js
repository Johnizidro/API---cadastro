const mongoose = require("mongoose");

const produtoSchema = new mongoose.Schema({
  nome: String,
  preco: Number,
  descricao: String,
  emEstoque: Boolean,
  cor: String, // <-- novo campo
  quantidade: Number, // <-- novo campo
  imagem: {
    data: Buffer,
    contentType: String,
  },
});

module.exports = mongoose.model("Produto", produtoSchema);
