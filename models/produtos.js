const mongoose = require('mongoose');

const produtoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  preco: {
    type: Number,
    required: true,
  },
  descricao: {
    type: String,
    required: true,
  },
  emEstoque: {
    type: Boolean,
    required: true,
  },
}, { timestamps: true }); // Para adicionar campos de criação/atualização automaticamente

const Produto = mongoose.model('Produto', produtoSchema);

module.exports = Produto;
