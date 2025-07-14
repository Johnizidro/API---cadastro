const Produto = require("../models/produtos");


exports.createProduto = async (req, res) => {
  const { nome, preco, descricao, emEstoque } = req.body;

  if (!nome || !preco || !descricao) {
    return res.status(400).json({ erro: "Preencha todos os campos obrigatórios!" });
  }

  try {
    const produto = new Produto({ nome, preco, descricao, emEstoque });
    await produto.save();
    res.status(201).json(produto); 
  } catch (err) {
    res.status(500).json({ erro: "Erro ao cadastrar o produto!" });
  }
};


exports.getProdutos = async (req, res) => {
  try {
    const produtos = await Produto.find();
    res.status(200).json(produtos); 
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar os produtos" });
  }
};


exports.getProdutoById = async (req, res) => {
  const { id } = req.params;

  try {
    const produto = await Produto.findById(id);
    if (!produto) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }
    res.status(200).json(produto);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar produto" });
  }
};


exports.updateProduto = async (req, res) => {
  const { id } = req.params;
  const { nome, preco, descricao, emEstoque } = req.body;

 
  if (!nome && !preco && !descricao && typeof emEstoque !== "boolean") {
    return res.status(400).json({ erro: "Pelo menos um campo deve ser enviado para atualização!" });
  }

  try {
    const produto = await Produto.findByIdAndUpdate(id, {
      nome,
      preco,
      descricao,
      emEstoque
    }, { new: true });

    if (!produto) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    res.status(200).json(produto); 
  } catch (err) {
    res.status(500).json({ erro: "Erro ao atualizar produto" });
  }
};


exports.deleteProduto = async (req, res) => {
  const { id } = req.params;

  try {
    const produto = await Produto.findByIdAndDelete(id);

    if (!produto) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    res.status(204).send(); 
  } catch (err) {
    res.status(500).json({ erro: "Erro ao remover produto" });
  }
};
