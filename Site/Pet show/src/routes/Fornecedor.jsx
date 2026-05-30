import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Fornecedor() {
  const [produtos, setProdutos] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  
  const [editando, setEditando] = useState(null);
  const [novoValor, setNovoValor] = useState("");
  const [confirmarRemocao, setConfirmarRemocao] = useState(null);

  // ESTADO PARA NOTIFICAÇÕES INLINE DO SITE
  const [notificacao, setNotificacao] = useState(null);

  const navigate = useNavigate();
  const [novoProduto, setNovoProduto] = useState({
    nome: "", descricao: "", preco: "", quantidadeDisponivel: "", promocao: "0", imagens: "", animal: "gato", classe: "comida"
  });

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("Pessoa"));
    if (!usuario || usuario.tipo?.trim().toLowerCase() !== "fornecedor") {
      navigate("/login");
      return;
    }
    carregarProdutos();
  }, [navigate]);

  const mostrarMensagem = (texto, tipo = "sucesso") => {
    setNotificacao({ texto, tipo });
    setTimeout(() => setNotificacao(null), 4000);
  };

  const carregarProdutos = async () => {
    try {
      const res = await fetch("http://localhost:3000/Produto");
      const data = await res.json();
      setProdutos(data);
    } catch (error) {
      console.error(error);
    }
  };

  const executarRemocao = async (id) => {
    try {
      await fetch(`http://localhost:3000/Produto/${id}`, { method: "DELETE" });
      mostrarMensagem("Produto removido com sucesso!", "sucesso");
      setConfirmarRemocao(null);
      carregarProdutos();
    } catch (error) {
      mostrarMensagem("Erro ao remover produto.", "erro");
    }
  };

  const iniciarEdicao = (id, campoBancodeDados, nomeExibicao, valorAtual, tipoInput = "text") => {
    setEditando({ id, campoBancodeDados, nomeExibicao, tipoInput });
    setNovoValor(valorAtual || "");
    setConfirmarRemocao(null);
  };

  const salvarEdicao = async (e) => {
    e.preventDefault();
    let valorFinal = novoValor;
    
    if (editando.tipoInput === "number") {
      valorFinal = parseFloat(novoValor);
      if (isNaN(valorFinal)) {
        mostrarMensagem("Por favor, digite um número válido!", "erro");
        return;
      }
    }

    try {
      const res = await fetch(`http://localhost:3000/Produto/${editando.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [editando.campoBancodeDados]: valorFinal }),
      });
      if (res.ok) {
        mostrarMensagem(`${editando.nomeExibicao} alterado com sucesso!`, "sucesso");
        setEditando(null);
        carregarProdutos();
      } else {
        mostrarMensagem("Erro ao alterar no servidor.", "erro");
      }
    } catch (error) {
      mostrarMensagem("Erro na rede.", "erro");
    }
  };

  const handleInputChange = (e) => {
    setNovoProduto({ ...novoProduto, [e.target.name]: e.target.value });
  };

  const cadastrarProduto = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/Produto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoProduto),
      });

      if (res.ok) {
        mostrarMensagem("Produto cadastrado com sucesso!", "sucesso");
        setMostrarForm(false);
        carregarProdutos();
        setNovoProduto({ nome: "", descricao: "", preco: "", quantidadeDisponivel: "", promocao: "0", imagens: "", animal: "gato", classe: "comida" });
      } else {
        mostrarMensagem("Erro ao cadastrar produto.", "erro");
      }
    } catch (error) {
      mostrarMensagem("Erro de conexão.", "erro");
    }
  };

  return (
    <div style={{ padding: "20px", position: "relative" }}>
      
      {/* NOTIFICAÇÃO DO PROPRIO SITE */}
      {notificacao && (
        <div style={{
          position: "fixed", top: "20px", right: "20px", padding: "15px 25px", borderRadius: "5px", zIndex: 1000, color: "white", fontWeight: "bold",
          backgroundColor: notificacao.tipo === "sucesso" ? "#28a745" : "#dc3545"
        }}>
          {notificacao.texto}
        </div>
      )}

      <h1>Área do funcionário</h1>
      {/* ... O restante do HTML/JS permanece idêntico ao componente anterior que criamos ... */}
      <p>Gerencie os produtos em estoque.</p>

      <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
        <button onClick={() => navigate("/minhaConta")} style={{ padding: "10px", borderRadius: "4px", cursor: "pointer", border: "1px solid #ccc" }}>
          Voltar para Minha Conta
        </button>

        <button onClick={() => setMostrarForm(!mostrarForm)} style={{ backgroundColor: "#28a745", color: "white", border: "none", padding: "10px 15px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
          {mostrarForm ? "Cancelar Adição" : "+ Adicionar Novo Produto"}
        </button>
      </div>

      {mostrarForm && (
        <form onSubmit={cadastrarProduto} style={{ backgroundColor: "#eae6e5", padding: "20px", borderRadius: "8px", marginBottom: "20px", display: "grid", gap: "10px", maxWidth: "900px", margin: "0 auto 20px auto" }}>
          <h3>Cadastrar Novo Produto</h3>
          <input required name="nome" value={novoProduto.nome} onChange={handleInputChange} placeholder="Nome do Produto" style={{ padding: "8px" }} />
          <textarea required name="descricao" value={novoProduto.descricao} onChange={handleInputChange} placeholder="Descrição" style={{ padding: "8px" }} />
          <div style={{ display: "flex", gap: "10px" }}>
            <input required type="number" step="0.01" name="preco" value={novoProduto.preco} onChange={handleInputChange} placeholder="Preço" style={{ padding: "8px", flex: 1 }} />
            <input required type="number" name="quantidadeDisponivel" value={novoProduto.quantidadeDisponivel} onChange={handleInputChange} placeholder="Quantidade" style={{ padding: "8px", flex: 1 }} />
            <input required type="number" name="promocao" value={novoProduto.promocao} onChange={handleInputChange} placeholder="Desconto %" style={{ padding: "8px", flex: 1 }} />
          </div>
          <input required name="imagens" value={novoProduto.imagens} onChange={handleInputChange} placeholder="Link da Imagem (URL)" style={{ padding: "8px" }} />
          <div style={{ display: "flex", gap: "10px" }}>
            <select name="animal" value={novoProduto.animal} onChange={handleInputChange} style={{ padding: "8px", flex: 1 }}>
              <option value="gato">Gato</option>
              <option value="cachorro">Cachorro</option>
            </select>
            <select name="classe" value={novoProduto.classe} onChange={handleInputChange} style={{ padding: "8px", flex: 1 }}>
              <option value="comida">Comida</option>
              <option value="brinquedo">Brinquedo</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button type="button" onClick={() => setMostrarForm(false)} style={{ backgroundColor: "#dc3545", color: "white", padding: "10px", borderRadius: "4px", flex: 1 }}>Cancelar</button>
            <button type="submit" style={{ backgroundColor: "#28a745", color: "white", padding: "10px", borderRadius: "4px", flex: 1 }}>Salvar Produto</button>
          </div>
        </form>
      )}

      <hr />

      {produtos.map((produto) => {
        const idAtual = produto.id_produto || produto.id;
        return (
          <div key={idAtual} style={{ display: "flex", flexDirection: "column", border: "1px solid #ccc", padding: "20px", margin: "15px auto", maxWidth: "900px", borderRadius: "8px", backgroundColor: "#eae6e5" }}>
            {editando?.id === idAtual && (
              <form onSubmit={salvarEdicao} style={{ backgroundColor: "#fff", padding: "15px", borderRadius: "8px", marginBottom: "15px", border: "2px solid #ff9800" }}>
                <h4 style={{ margin: "0 0 10px 0" }}>Alterando: {editando.nomeExibicao}</h4>
                <div style={{ display: "flex", gap: "10px" }}>
                  <input type={editando.tipoInput} step={editando.tipoInput === "number" ? "0.01" : undefined} value={novoValor} onChange={(e) => setNovoValor(e.target.value)} style={{ flex: 1, padding: "8px" }} autoFocus />
                  <button type="submit" style={{ backgroundColor: "#28a745", color: "white", padding: "8px 15px", border: "none", borderRadius: "4px" }}>Salvar</button>
                  <button type="button" onClick={() => setEditando(null)} style={{ backgroundColor: "#dc3545", color: "white", padding: "8px 15px", border: "none", borderRadius: "4px" }}>Cancelar</button>
                </div>
              </form>
            )}

            {confirmarRemocao === idAtual && (
              <div style={{ backgroundColor: "#ffebee", padding: "15px", borderRadius: "8px", marginBottom: "15px", border: "2px solid #f44336" }}>
                <h4 style={{ margin: "0 0 10px 0", color: "#d32f2f" }}>Tem certeza que deseja remover este produto definitivamente?</h4>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => executarRemocao(idAtual)} style={{ backgroundColor: "#d32f2f", color: "white", padding: "8px 15px", border: "none", borderRadius: "4px", fontWeight: "bold" }}>Sim, remover produto</button>
                  <button onClick={() => setConfirmarRemocao(null)} style={{ backgroundColor: "#757575", color: "white", padding: "8px 15px", border: "none", borderRadius: "4px", fontWeight: "bold" }}>Cancelar</button>
                </div>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", gap: "50px" }}>
              <div style={{ flex: 1 }}> 
                <img src={produto.imagens} alt={produto.nome} width="180" style={{ borderRadius: "8px", marginBottom: "10px" }} />
                <h3 style={{ margin: "10px 0 5px 0" }}>{produto.nome}</h3>
                <p style={{ margin: "2px 0" }}><strong>Descrição:</strong> {produto.descricao}</p>
                <p style={{ margin: "2px 0" }}><strong>Quantidade:</strong> {produto.quantidade_disponivel || produto.quantidadeDisponivel}</p>
                <p style={{ margin: "2px 0" }}><strong>Preço Original:</strong> R$ {produto.preco}</p>
                <p style={{ margin: "2px 0" }}><strong>Desconto:</strong> {produto.promocao}%</p>
                <p style={{ margin: "2px 0" }}><strong>Preço Final:</strong> R$ {(produto.preco * ((100 - produto.promocao) / 100)).toFixed(2)}</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", minWidth: "180px" }}>
                <button style={{ backgroundColor: "#ff4d4d", color: "white", border: "none", padding: "10px", borderRadius: "4px", fontWeight: "bold" }} onClick={() => { setConfirmarRemocao(idAtual); setEditando(null); }}>Remover Produto</button>
                <button style={{ backgroundColor: "#4a4a4a", color: "white", border: "none", padding: "8px", borderRadius: "4px" }} onClick={() => iniciarEdicao(idAtual, "nome", "Nome do Produto", produto.nome)}>Alterar nome</button>
                <button style={{ backgroundColor: "#4a4a4a", color: "white", border: "none", padding: "8px", borderRadius: "4px" }} onClick={() => iniciarEdicao(idAtual, "descricao", "Descrição", produto.descricao)}>Alterar descrição</button>
                <button style={{ backgroundColor: "#4a4a4a", color: "white", border: "none", padding: "8px", borderRadius: "4px" }} onClick={() => iniciarEdicao(idAtual, "preco", "Preço", produto.preco, "number")}>Alterar preço</button>
                <button style={{ backgroundColor: "#4a4a4a", color: "white", border: "none", padding: "8px", borderRadius: "4px" }} onClick={() => iniciarEdicao(idAtual, "promocao", "Desconto (%)", produto.promocao, "number")}>Alterar desconto</button>
                <button style={{ backgroundColor: "#4a4a4a", color: "white", border: "none", padding: "8px", borderRadius: "4px" }} onClick={() => iniciarEdicao(idAtual, "imagens", "Link da Imagem", produto.imagens)}>Alterar imagem</button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Fornecedor;