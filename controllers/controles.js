const User = require("../models/usuario");
const bcrypt = require("bcrypt");
const transportador = require("../config/configEmail");
const jwt = require("jsonwebtoken");

exports.registrar = async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ msg: "Nome, email e senha são obrigatórios." });
  }

  try {
    const usuarioExistente = await User.findOne({ email: email.toLowerCase() });
    if (usuarioExistente) {
      console.log(`Tentativa de cadastro com e-mail já existente: ${email.toLowerCase()}`);
      return res.status(400).json({ msg: "E-mail já cadastrado." });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const novoUsuario = new User({
      nome,
      email: email.toLowerCase(),
      senha: senhaHash,
    });

    await novoUsuario.save();
    console.log(`Usuário salvo no banco: ${email.toLowerCase()}`);

    // Enviar email de boas-vindas
    try {
      console.log(`Enviando e-mail de boas-vindas para: ${email.toLowerCase()}`);
      await transportador.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: "Cadastro realizado com sucesso!",
        html: `<h2>Olá ${nome},</h2><p>Seu cadastro foi realizado com sucesso!</p>`,
      });
      console.log("E-mail de boas-vindas enviado com sucesso!");
    } catch (erroEmail) {
      console.error("❌ Falha ao enviar e-mail de boas-vindas:", erroEmail);
      // Opcional: você pode informar o usuário que houve falha no envio do e-mail
    }

    return res.status(201).json({ msg: "Usuário registrado e e-mail enviado!" });
  } catch (erro) {
    console.error("Erro no registro:", erro);
    return res.status(500).json({ msg: "Erro interno no servidor." });
  }
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ msg: "Email e senha são obrigatórios." });
  }

  try {
    const usuario = await User.findOne({ email: email.toLowerCase() });
    if (!usuario) {
      return res.status(401).json({ msg: "Credenciais inválidas." });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ msg: "Credenciais inválidas." });
    }

    const token = jwt.sign({ id: usuario._id, email: usuario.email }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    return res.json({ msg: "Login bem-sucedido", token });
  } catch (erro) {
    console.error("Erro no login:", erro.message);
    return res.status(500).json({ msg: "Erro interno no servidor." });
  }
};