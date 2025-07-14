# API RESTful para Cadastro de Produtos

## Descrição

Essa API tem como objetivo permitir o cadastro e gerenciamento de produtos. Ela oferece endpoints para criar, listar, atualizar e excluir produtos.

## 🚀 Tecnologias Utilizadas

- ⚙️ Node.js
- 📁 Express
- 🍃 MongoDB — banco de dados NoSQL
- 🧪 Postman — para testar as rotas da API

### Funcionalidades:

- **Cadastro de produtos** (POST)
- **Listagem de produtos** (GET)
- **Atualização de produto** (PUT)
- **Remoção de produto** (DELETE)

---



## Endpoints

### 1. ▶️ **Criar um novo produto**

- **Método:** `POST`
- **Rota:** `/api/cadastro`
- **Descrição:** Cadastra um novo produto.
- **Corpo da requisição:**
  ```json
  {
    "nome": "Produto Exemplo",
    "descricao": "Descrição do produto",
    "preco": 199.99,
    "emEstoque": true
  }


### 2. ▶️ **Listar todos os produtos**
- **Método:** `GET`
- **Rota:** `/api/produtos`
- **Descrição:** Retorna todos os produtos cadastrados.


### 3. ▶️ **Atualizar um produto**
- **Método:** `PUT`
- **Rota:** `/api/cadastro/:id`
- **Descrição:** Atualiza as informações de um produto específico.
- **Corpo da requisição:**
  ```json  
  {
  "nome": "Produto Atualizado",
  "descricao": "Nova descrição",
  "preco": 249.99,
   "emEstoque": false
  }
  
### 4. ▶️ **Remover um produto**
- **Método:** `DELETE  `
- **Rota:** `/api/cadastro/:id`
- **Descrição:** Remove um produto do cadastro.

