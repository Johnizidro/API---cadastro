const Produto = require("../models/produtos");


exports.createProduto = async (req, res) => {
  try {
    console.log('Body:', req.body);
    console.log('File:', req.file);

    const { nome, preco, descricao, emEstoque } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Imagem não enviada' });
    }

    const produto = new Produto({
      nome,
      preco,
      descricao,
      emEstoque,
      imagem: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      }
    });

    await produto.save();
    res.status(201).json({ message: "Produto criado com imagem!" });
  } catch (err) {
    console.error('Erro ao salvar produto:', err);
    res.status(500).json({ erro: 'Erro ao salvar produto' });
  }
};


exports.getProdutos = async (req, res) => {
  try {
    const produtos = await Produto.find();

    // Mapeia os produtos para incluir a imagem em base64
    const produtosComImagem = produtos.map(produto => {
      let imagemBase64 = null;
      if (produto.imagem && produto.imagem.data) {
        imagemBase64 = `data:${produto.imagem.contentType};base64,${produto.imagem.data.toString('base64')}`;
      }
      return {
        _id: produto._id,
        nome: produto.nome,
        preco: produto.preco,
        descricao: produto.descricao,
        emEstoque: produto.emEstoque,
        imagem: imagemBase64 // null se não tiver imagem
      };
    });

    res.status(200).json(produtosComImagem);
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

    // Se existir imagem, converte para base64
    let imagemBase64 = null;
    if (produto.imagem && produto.imagem.data) {
      imagemBase64 = `data:${produto.imagem.contentType};base64,${produto.imagem.data.toString('base64')}`;
    }

    // Monta resposta com os dados + imagem em base64
    res.status(200).json({
      _id: produto._id,
      nome: produto.nome,
      preco: produto.preco,
      descricao: produto.descricao,
      emEstoque: produto.emEstoque,
      imagem: imagemBase64, // null se não tiver imagem
    });

  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar produto" });
  }
};


exports.updateProduto = async (req, res) => {
  const { id } = req.params;
  const { nome, preco, descricao, emEstoque } = req.body;

  // Validar pelo menos um campo válido (considerando que emEstoque pode ser string ou boolean)
  if (!nome && !preco && !descricao && typeof emEstoque === "undefined" && !req.file) {
    return res.status(400).json({ erro: "Pelo menos um campo deve ser enviado para atualização!" });
  }

  try {
    // Monta objeto para atualizar só os campos enviados
    const updateData = {};

    if (nome) updateData.nome = nome;
    if (preco) updateData.preco = preco;
    if (descricao) updateData.descricao = descricao;
    if (typeof emEstoque !== "undefined") {
      // emEstoque pode vir como string 'true'/'false', converte para boolean
      updateData.emEstoque = emEstoque === 'true' || emEstoque === true;
    }

    if (req.file) {
      updateData.imagem = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    const produto = await Produto.findByIdAndUpdate(id, updateData, { new: true });

    if (!produto) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    res.status(200).json(produto);
  } catch (err) {
    console.error('Erro ao atualizar produto:', err);
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
