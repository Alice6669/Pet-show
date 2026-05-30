import express from 'express';
import cors from 'cors';
import db from './db.js';

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   PRODUTO
========================= */

// Listar todos os produtos
app.get('/Produto', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id_produto AS id,
        nome,
        quantidade_disponivel AS quantidadeDisponivel,
        descricao,
        preco,
        imagens,
        promocao,
        animal,
        classe
      FROM Produto
    `);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar produtos' });
  }
});

// Buscar produto por ID
app.get('/Produto/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT
        id_produto AS id,
        nome,
        quantidade_disponivel AS quantidadeDisponivel,
        descricao,
        preco,
        imagens,
        promocao,
        animal,
        classe
      FROM Produto
      WHERE id_produto = ?
      `,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar produto' });
  }
});

// Cadastrar produto
app.post('/Produto', async (req, res) => {
  try {
    const {
      nome,
      quantidadeDisponivel,
      descricao,
      preco,
      imagens,
      promocao,
      animal,
      classe
    } = req.body;

    const [result] = await db.query(
      `
      INSERT INTO Produto
      (
        nome,
        quantidade_disponivel,
        descricao,
        preco,
        imagens,
        promocao,
        animal,
        classe
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        nome,
        quantidadeDisponivel,
        descricao,
        preco,
        imagens,
        promocao,
        animal,
        classe
      ]
    );

    res.status(201).json({
      id: result.insertId,
      nome,
      quantidadeDisponivel,
      descricao,
      preco,
      imagens,
      promocao,
      animal,
      classe
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao cadastrar produto' });
  }
});

// Atualizar produto específico (Corrigido para async/await)
app.patch('/Produto/:id', async (req, res) => {
  try {
    const id_produto = req.params.id;
    const atualizacoes = req.body; 

    // Pega o nome da coluna e o novo valor que vieram do front
    const coluna = Object.keys(atualizacoes)[0];
    const novoValor = atualizacoes[coluna];

    // Monta a query dinamicamente e executa com await
    const [result] = await db.query(
      `UPDATE Produto SET ?? = ? WHERE id_produto = ?`,
      [coluna, novoValor, id_produto]
    );
        
    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    res.status(200).json({ mensagem: "Produto atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    res.status(500).json({ erro: "Erro interno no banco de dados" });
  }
});

// Excluir produto (Rota que estava faltando)
app.delete('/Produto/:id', async (req, res) => {
  try {
    const idProduto = req.params.id;

    // 1º PASSO: Remove o produto do carrinho de compras dos clientes
    await db.query(
      'DELETE FROM ClienteProduto WHERE id_fk_produto = ?',
      [idProduto]
    );

    // 2º PASSO: Remove a ligação do produto com os fornecedores
    await db.query(
      'DELETE FROM FornecedorProduto WHERE id_fk_produto = ?',
      [idProduto]
    );

    // 3º PASSO: Agora sim, com tudo limpo, deleta o produto da tabela principal
    const [result] = await db.query(
      'DELETE FROM Produto WHERE id_produto = ?',
      [idProduto]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }

    res.json({ mensagem: 'Produto removido com sucesso' });
  } catch (error) {
    console.error("Erro no servidor ao excluir produto:", error);
    res.status(500).json({ erro: 'Erro ao excluir produto' });
  }
});

/* =========================
   PESSOA
========================= */

// Listar todas as pessoas
app.get('/Pessoa', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id_pessoa as id,
        nome,
        email,
        senha,
        tipo
      FROM Pessoa
    `);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar pessoas' });
  }
});

// Buscar pessoa por ID
app.get('/Pessoa/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT
        id_pessoa as id,
        nome,
        email,
        senha,
        tipo
      FROM Pessoa
      WHERE id_pessoa = ?
      `,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ erro: 'Pessoa não encontrada' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar pessoa' });
  }
});

// Cadastrar pessoa
app.post('/Pessoa', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    const [result] = await db.query(
      `
      INSERT INTO Pessoa (nome, email, senha)
      VALUES (?, ?, ?)
      `,
      [nome, email, senha]
    );

    res.status(201).json({
      id_pessoa: result.insertId,
      nome,
      email,
      senha
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao cadastrar pessoa' });
  }
});

// Atualizar pessoa (Alterado para PATCH e corrigido para o seu banco)
app.patch('/Pessoa/:id', async (req, res) => {
  try {
    const { nome, email, senha, id_pessoa: id_body } = req.body;
    // Tenta pegar o ID da URL ou do corpo da requisição
    const id_pessoa = req.params.id || id_body;

    if (!id_pessoa || id_pessoa === 'undefined') {
      console.error("Erro: id_pessoa não recebido no servidor.");
      return res.status(400).json({ error: "ID do usuário é obrigatório." });
    }

    // O COALESCE faz o seguinte: Se o valor enviado for nulo, ele mantém o que já está no banco
    await db.query(
      `
      UPDATE Pessoa 
      SET nome = COALESCE(?, nome), 
          email = COALESCE(?, email), 
          senha = COALESCE(?, senha)
      WHERE id_pessoa = ?
      `,
      [nome || null, email || null, senha || null, id_pessoa]
    );

    res.json({ mensagem: "Dados atualizados com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao atualizar no MySQL' });
  }
});

// Excluir pessoa
app.delete('/Pessoa/:id', async (req, res) => {
  try {
    await db.query(
      'DELETE FROM Pessoa WHERE id_pessoa = ?',
      [req.params.id]
    );

    res.json({ mensagem: 'Pessoa removida com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao excluir pessoa' });
  }
});

/* =========================
   CARRINHO (ClienteProduto)
========================= */

// Buscar itens do carrinho de um cliente específico
app.get('/Carrinho/:id_cliente', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.*, 
        cp.id_cliente_produto 
      FROM Produto p
      INNER JOIN ClienteProduto cp ON p.id_produto = cp.id_fk_produto
      WHERE cp.id_fk_cliente = ?
    `, [req.params.id_cliente]);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar o carrinho do cliente' });
  }
});

// Remover um item específico do carrinho
app.delete('/Carrinho/Item/:id_cliente_produto', async (req, res) => {
  try {
    await db.query(
      'DELETE FROM ClienteProduto WHERE id_cliente_produto = ?',
      [req.params.id_cliente_produto]
    );
    res.json({ mensagem: 'Item removido do carrinho' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao remover item do carrinho' });
  }
});

// Limpar todo o carrinho após finalizar a compra
app.delete('/Carrinho/Limpar/:id_cliente', async (req, res) => {
  try {
    await db.query(
      'DELETE FROM ClienteProduto WHERE id_fk_cliente = ?',
      [req.params.id_cliente]
    );
    res.json({ mensagem: 'Compra finalizada, carrinho limpo' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao limpar carrinho' });
  }
});

// Adicionar um produto ao carrinho no banco de dados
app.post('/Carrinho', async (req, res) => {
  try {
    const { id_fk_produto, id_fk_cliente } = req.body;

    if (!id_fk_produto || !id_fk_cliente) {
      return res.status(400).json({ erro: 'ID do cliente e ID do produto são obrigatórios.' });
    }

    const [result] = await db.query(
      `INSERT INTO ClienteProduto (id_fk_produto, id_fk_cliente) VALUES (?, ?)`,
      [id_fk_produto, id_fk_cliente]
    );

    res.status(201).json({
      mensagem: 'Produto adicionado ao carrinho com sucesso!',
      id_cliente_produto: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao adicionar item ao carrinho no banco de dados' });
  }
});

/* =========================
   LOGIN
========================= */

app.post('/Login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    const [rows] = await db.query(
      `
      SELECT
        id_pessoa,
        nome,
        email,
        tipo
      FROM Pessoa
      WHERE email = ? AND senha = ?
      `,
      [email, senha]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        erro: 'Email ou senha incorretos'
      });
    }

    res.json({
      mensagem: 'Login realizado com sucesso',
      usuario: rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao realizar login' });
  }
});

app.get('/', (req, res) => {
  res.send('API nova funcionando');
});

/* =========================
   ENDEREÇO
========================= */

app.delete('/Endereco/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM Endereco WHERE id_endereco = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ erro: 'Endereço não encontrado' });
    res.json({ mensagem: 'Endereço removido com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao excluir endereço' });
  }
});

// Listar todos os endereços
app.get("/Endereco", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id_endereco AS id,
        estado,
        cidade,
        bairro,
        rua,
        numero,
        complemento,
        id_fk_pessoa
      FROM Endereco
    `);

    res.json(rows);
  } catch (error) {
    console.error("Erro ao listar endereços:", error);
    res.status(500).json({ erro: "Erro ao listar endereços" });
  }
});

// Buscar endereço de uma pessoa específica
app.get("/Endereco/Pessoa/:id", async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT
        id_endereco AS id,
        estado,
        cidade,
        bairro,
        rua,
        numero,
        complemento,
        id_fk_pessoa
      FROM Endereco
      WHERE id_fk_pessoa = ?
      `,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ erro: "Endereço não encontrado" });
    }

    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar endereço:", error);
    res.status(500).json({ erro: "Erro ao buscar endereço" });
  }
});

// Cadastrar endereço
app.post("/Endereco", async (req, res) => {
  try {
    const {
      estado,
      cidade,
      bairro,
      rua,
      numero,
      complemento,
      id_fk_pessoa
    } = req.body;

    const [result] = await db.query(
      `
      INSERT INTO Endereco
      (estado, cidade, bairro, rua, numero, complemento, id_fk_pessoa)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [estado, cidade, bairro, rua, numero, complemento, id_fk_pessoa]
    );

    res.status(201).json({
      id: result.insertId,
      estado,
      cidade,
      bairro,
      rua,
      numero,
      complemento,
      id_fk_pessoa
    });

  } catch (error) {
    console.error("Erro ao cadastrar endereço:", error);
    res.status(500).json({ erro: "Erro ao cadastrar endereço" });
  }
});

app.patch('/Endereco/:id', async (req, res) => {
  try {
    const id_endereco = req.params.id;
    const atualizacoes = req.body; 

    const coluna = Object.keys(atualizacoes)[0];
    const novoValor = atualizacoes[coluna];

    const [result] = await db.query(
      `UPDATE Endereco SET ?? = ? WHERE id_endereco = ?`,
      [coluna, novoValor, id_endereco]
    );
        
    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Endereço não encontrado" });
    }

    res.status(200).json({ mensagem: "Endereço atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar endereço:", error);
    res.status(500).json({ erro: "Erro interno no banco de dados" });
  }
});


/* =========================
   TELEFONE
========================= */

app.delete('/Telefone/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM Telefone WHERE id_telefone = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ erro: 'Telefone não encontrado' });
    res.json({ mensagem: 'Telefone removido com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao excluir telefone' });
  }
});

// Listar todos os telefones
app.get("/Telefone", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        tipo,
        numero,
        id_fk_pessoa
      FROM Telefone
    `);

    res.json(rows);
  } catch (error) {
    console.error("Erro ao listar telefones:", error);
    res.status(500).json({ erro: "Erro ao listar telefones" });
  }
});

// Buscar telefone de uma pessoa específica
app.get("/Telefone/Pessoa/:id", async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT
        tipo,
        numero,
        id_fk_pessoa
      FROM Telefone
      WHERE id_fk_pessoa = ?
      `,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ erro: "Telefone não encontrado" });
    }

    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar telefone:", error);
    res.status(500).json({ erro: "Erro ao buscar telefone" });
  }
});

// Cadastrar telefone
app.post("/Telefone", async (req, res) => {
  try {
    const {
      tipo,
      numero,
      id_fk_pessoa
    } = req.body;

    const [result] = await db.query(
      `
      INSERT INTO Telefone
      (tipo, numero, id_fk_pessoa)
      VALUES (?, ?, ?)
      `,
      [tipo, numero, id_fk_pessoa]
    );

    res.status(201).json({
      mensagem: "Telefone cadastrado com sucesso",
      tipo,
      numero,
      id_fk_pessoa
    });

  } catch (error) {
    console.error("Erro ao cadastrar telefone:", error);
    res.status(500).json({ erro: "Erro ao cadastrar telefone" });
  }
});

// IMPORTANTE: Sua tabela de Telefone precisa ter uma coluna identificadora, como 'id_telefone'.
app.patch('/Telefone/:id', async (req, res) => {
  try {
    const id_telefone = req.params.id;
    const atualizacoes = req.body; 

    const coluna = Object.keys(atualizacoes)[0];
    const novoValor = atualizacoes[coluna];

    const [result] = await db.query(
      `UPDATE Telefone SET ?? = ? WHERE id_telefone = ?`,
      [coluna, novoValor, id_telefone]
    );
        
    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Telefone não encontrado" });
    }

    res.status(200).json({ mensagem: "Telefone atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar telefone:", error);
    res.status(500).json({ erro: "Erro interno no banco de dados" });
  }
});


/* =========================
   SERVIDOR
========================= */

app.listen(3000, () => {
  console.log('API rodando em http://localhost:3000');
});

app.get('/Teste', (req, res) => {
  res.json({ mensagem: 'Rota Teste funcionando' });
});