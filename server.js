const express = require("express");
const dotenv = require("dotenv");
const produtoRoutes = require("./routes/produtoRoutes"); 
const authRoutes = require("./routes/rotas");
const app = express();
const PORT = 4000;
require("./config/db");
const cors = require('cors');

app.use(express.json());
app.use(cors());


app.use("/produtos", produtoRoutes);
app.use("/api", authRoutes);


app.listen(PORT, () => {  console.log(`Servidor rodando na porta ${PORT}`);
});

