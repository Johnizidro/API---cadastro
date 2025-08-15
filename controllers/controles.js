const User = require("../models/usuario");
const bcrypt = require("bcrypt");
const transportador = require("../config/configEmail");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

exports.registrar = async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ msg: "Nome, email e senha são obrigatórios." });
  }

  try {
    // Garante que nenhum usuário com o mesmo email exista
    const usuarioExistente = await User.findOne({ email: email.toLowerCase() });
    if (usuarioExistente) {
      return res.status(400).json({ msg: "E-mail já cadastrado." });
    }

    // Cria hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Cria novo usuário
    const novoUsuario = new User({
      nome,
      email: email.toLowerCase(),
      senha: senhaHash,
    });

    // Salva no banco
    await novoUsuario.save();

    // Tenta enviar o e-mail de boas-vindas, mas não bloqueia o cadastro se falhar
    transportador.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: "Cadastro realizado com sucesso!",
      html: `<h2>Olá ${nome},</h2><p>Seu cadastro foi realizado com sucesso!</p>`,
    }).then(() => {
      console.log(`E-mail de boas-vindas enviado para: ${email.toLowerCase()}`);
    }).catch((erroEmail) => {
      console.error("Falha ao enviar e-mail de boas-vindas:", erroEmail);
    });

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

exports.solicitarResetSenha = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ msg: "O e-mail é obrigatório." });

  try {
    const usuario = await User.findOne({ email: email.toLowerCase() });
    if (!usuario) return res.status(404).json({ msg: "Usuário não encontrado." });

    // Gerar token único
    const token = crypto.randomBytes(32).toString("hex");

    // Salvar no banco com expiração (1h)
    usuario.resetPasswordToken = token;
    usuario.resetPasswordExpires = Date.now() + 3600000; // 1 hora
    await usuario.save();

    const link = `http://127.0.0.1:5500/html/redefSenha.html?token=${usuario.resetPasswordToken}`; // link para sua página de redefinição

    // Enviar e-mail
    await transportador.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: usuario.email,
      subject: "Recuperação de senha",
      html: `<p>Você solicitou a redefinição de senha.</p>
             <p>Clique no link abaixo para criar uma nova senha (válido por 1 hora):</p>
             <a href="${link}">${link}</a>`
    });

    return res.json({ msg: "E-mail de redefinição enviado." });
  } catch (erro) {
    console.error("Erro ao solicitar redefinição:", erro);
    return res.status(500).json({ msg: "Erro interno no servidor." });
  }
};

// 2. Redefinir a senha
exports.resetarSenha = async (req, res) => {
  const { token } = req.params;
  const { novaSenha } = req.body;

  if (!novaSenha) return res.status(400).json({ msg: "A nova senha é obrigatória." });

  try {
    const usuario = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() } // ainda válido
    });

    if (!usuario) return res.status(400).json({ msg: "Token inválido ou expirado." });

    // Atualizar senha
    const senhaHash = await bcrypt.hash(novaSenha, 10);
    usuario.senha = senhaHash;
    usuario.resetPasswordToken = undefined;
    usuario.resetPasswordExpires = undefined;
    await usuario.save();

    return res.json({ msg: "Senha redefinida com sucesso." });
  } catch (erro) {
    console.error("Erro ao redefinir senha:", erro);
    return res.status(500).json({ msg: "Erro interno no servidor." });
  }
};