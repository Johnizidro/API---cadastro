# API RESTful para Cadastro de Produtos

## Descrição

Essa API tem como objetivo permitir o cadastro e gerenciamento de produtos. Ela oferece endpoints para criar, listar, atualizar e excluir produtos.

### Funcionalidades:

- **Cadastro de produtos** (POST)
- **Listagem de produtos** (GET)
- **Atualização de produto** (PUT)
- **Remoção de produto** (DELETE)

---

## Tecnologias

- **Node.js** com **Express** (para criação da API)
- **MongoDB** (para armazenamento dos dados)
- **Mongoose** (para modelagem dos dados)

---

## Endpoints

### 1. **Criar um novo produto**

- **Método:** `POST`
- **Rota:** `/api/produtos`
- **Descrição:** Cadastra um novo produto.
- **Corpo da requisição:**
  ```json
  {
    "nome": "Produto Exemplo",
    "descricao": "Descrição do produto",
    "preco": 199.99,
    "quantidade": 10
  }
