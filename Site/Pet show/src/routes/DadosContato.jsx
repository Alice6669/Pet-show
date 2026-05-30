import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function DadosContato() {
  const [enderecos, setEnderecos] = useState([]);
  const [telefones, setTelefones] = useState([]);
  
  // Estados de controle de tela
  const [editando, setEditando] = useState(null); 
  const [novoValor, setNovoValor] = useState("");
  const [confirmarRemocao, setConfirmarRemocao] = useState(null); // { id, tabela }
  
  // Estado para a mensagensinha do site (notificação)
  const [notificacao, setNotificacao] = useState(null); // { texto: "", tipo: "sucesso" | "erro" }

  // Estados para os formulários de adição
  const [mostrarFormEnd, setMostrarFormEnd] = useState(false);
  const [novoEnd, setNovoEnd] = useState({ estado: "", cidade: "", bairro: "", rua: "", numero: "", complemento: "" });
  
  const [mostrarFormTel, setMostrarFormTel] = useState(false);
  const [novoTel, setNovoTel] = useState({ tipo: "CEL", numero: "" });

  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("Pessoa"));
  const idUsuario = usuario?.id || usuario?.id_pessoa;

  useEffect(() => {
    if (!usuario) {
      navigate("/login");
      return;
    }
    carregarDados();
  }, [navigate]);

  // Função auxiliar para disparar a mensagensinha na tela
  const mostrarMensagem = (texto, tipo = "sucesso") => {
    setNotificacao({ texto, tipo });
    setTimeout(() => setNotificacao(null), 4000); // Some após 4 segundos
  };

  const carregarDados = async () => {
    try {
      const resEnd = await fetch(`http://localhost:3000/Endereco/Pessoa/${idUsuario}`);
      if (resEnd.ok) {
        const dataEnd = await resEnd.json();
        setEnderecos(Array.isArray(dataEnd) ? dataEnd : [dataEnd]);
      } else {
        setEnderecos([]);
      }

      const resTel = await fetch(`http://localhost:3000/Telefone/Pessoa/${idUsuario}`);
      if (resTel.ok) {
        const dataTel = await resTel.json();
        setTelefones(Array.isArray(dataTel) ? dataTel : [dataTel]);
      } else {
        setTelefones([]);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  const iniciarEdicao = (tabela, idItem, campoBancodeDados, nomeExibicao, valorAtual) => {
    setEditando({ tabela, idItem, campoBancodeDados, nomeExibicao });
    setNovoValor(valorAtual || "");
    setConfirmarRemocao(null);
  };

  const salvarEdicao = async (e) => {
    e.preventDefault();
    if (!novoValor || String(novoValor).trim() === "") {
      mostrarMensagem("O valor não pode ficar vazio!", "erro");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/${editando.tabela}/${editando.idItem}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [editando.campoBancodeDados]: novoValor }),
      });

      if (res.ok) {
        mostrarMensagem(`${editando.nomeExibicao} alterado com sucesso!`, "sucesso");
        setEditando(null);
        carregarDados();
      } else {
        mostrarMensagem("Erro ao salvar alteração no servidor.", "erro");
      }
    } catch (error) {
      mostrarMensagem("Erro na conexão com o servidor.", "erro");
    }
  };

  const executarRemocao = async (id, tabela) => {
    try {
      const res = await fetch(`http://localhost:3000/${tabela}/${id}`, { method: "DELETE" });
      if (res.ok) {
        mostrarMensagem(`${tabela === "Endereco" ? "Endereço" : "Telefone"} excluído com sucesso!`, "sucesso");
        setConfirmarRemocao(null);
        carregarDados();
      } else {
        mostrarMensagem("Erro ao excluir do servidor.", "erro");
      }
    } catch (error) {
      mostrarMensagem("Erro de conexão ao excluir.", "erro");
    }
  };

  const cadastrarEndereco = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/Endereco", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...novoEnd, id_fk_pessoa: idUsuario }),
      });
      if (res.ok) {
        mostrarMensagem("Novo endereço adicionado!", "sucesso");
        setMostrarFormEnd(false);
        setNovoEnd({ estado: "", cidade: "", bairro: "", rua: "", numero: "", complemento: "" });
        carregarDados();
      } else {
        mostrarMensagem("Erro ao cadastrar endereço.", "erro");
      }
    } catch (error) {
      mostrarMensagem("Erro no servidor.", "erro");
    }
  };

  const cadastrarTelefone = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/Telefone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...novoTel, id_fk_pessoa: idUsuario }),
      });
      if (res.ok) {
        mostrarMensagem("Novo telefone adicionado!", "sucesso");
        setMostrarFormTel(false);
        setNovoTel({ tipo: "CEL", numero: "" });
        carregarDados();
      } else {
        mostrarMensagem("Erro ao cadastrar telefone.", "erro");
      }
    } catch (error) {
      mostrarMensagem("Erro no servidor.", "erro");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto", position: "relative" }}>
      
      {/* MENSAGENSINHA DO SITE (NOTIFICAÇÃO FLUTUANTE) */}
      {notificacao && (
        <div style={{
          position: "fixed", top: "20px", right: "20px", padding: "15px 25px", borderRadius: "5px", zIndex: 1000, color: "white", fontWeight: "bold", boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
          backgroundColor: notificacao.tipo === "sucesso" ? "#28a745" : "#dc3545"
        }}>
          {notificacao.texto}
        </div>
      )}

      <h1>Meus Dados de Contato</h1>
      
      <div style={{ display: "flex", gap: "10px", marginBottom: "25px" }}>
        <button onClick={() => navigate("/minhaConta")} style={{ padding: "10px", borderRadius: "4px", cursor: "pointer", border: "1px solid #ccc" }}>Voltar</button>
        <button onClick={() => { setMostrarFormEnd(!mostrarFormEnd); setMostrarFormTel(false); }} style={{ backgroundColor: "#28a745", color: "white", border: "none", padding: "10px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>+ Adicionar Endereço</button>
        <button onClick={() => { setMostrarFormTel(!mostrarFormTel); setMostrarFormEnd(false); }} style={{ backgroundColor: "#17a2b8", color: "white", border: "none", padding: "10px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>+ Adicionar Telefone</button>
      </div>

      {/* FORMULÁRIO ADICIONAR ENDEREÇO */}
      {mostrarFormEnd && (
        <form onSubmit={cadastrarEndereco} style={{ backgroundColor: "#eae6e5", padding: "20px", borderRadius: "8px", marginBottom: "20px", display: "grid", gap: "10px" }}>
          <h3>Novo Endereço</h3>
          <div style={{ display: "flex", gap: "10px" }}>
            <input required placeholder="Estado (Ex: MG)" value={novoEnd.estado} onChange={e => setNovoEnd({...novoEnd, estado: e.target.value})} style={{ padding: "8px", flex: 1 }} />
            <input required placeholder="Cidade" value={novoEnd.cidade} onChange={e => setNovoEnd({...novoEnd, cidade: e.target.value})} style={{ padding: "8px", flex: 2 }} />
          </div>
          <input required placeholder="Bairro" value={novoEnd.bairro} onChange={e => setNovoEnd({...novoEnd, bairro: e.target.value})} style={{ padding: "8px" }} />
          <input required placeholder="Rua" value={novoEnd.rua} onChange={e => setNovoEnd({...novoEnd, rua: e.target.value})} style={{ padding: "8px" }} />
          <div style={{ display: "flex", gap: "10px" }}>
            <input required type="number" placeholder="Número" value={novoEnd.numero} onChange={e => setNovoEnd({...novoEnd, numero: e.target.value})} style={{ padding: "8px", flex: 1 }} />
            <input placeholder="Complemento" value={novoEnd.complemento} onChange={e => setNovoEnd({...novoEnd, complemento: e.target.value})} style={{ padding: "8px", flex: 2 }} />
          </div>
          <button type="submit" style={{ backgroundColor: "#28a745", color: "white", padding: "10px", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>Salvar Endereço</button>
        </form>
      )}

      {/* FORMULÁRIO ADICIONAR TELEFONE */}
      {mostrarFormTel && (
        <form onSubmit={cadastrarTelefone} style={{ backgroundColor: "#eae6e5", padding: "20px", borderRadius: "8px", marginBottom: "20px", display: "grid", gap: "10px" }}>
          <h3>Novo Telefone</h3>
          <select value={novoTel.tipo} onChange={e => setNovoTel({...novoTel, tipo: e.target.value})} style={{ padding: "8px" }}>
            <option value="CEL">Celular</option>
            <option value="TEL">Telefone</option>
            <option value="COM">Comercial</option>
          </select>
          <input required placeholder="Número com DDD" value={novoTel.numero} onChange={e => setNovoTel({...novoTel, numero: e.target.value})} style={{ padding: "8px" }} />
          <button type="submit" style={{ backgroundColor: "#17a2b8", color: "white", padding: "10px", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>Salvar Telefone</button>
        </form>
      )}

      {/* LISTA DE ENDEREÇOS */}
      <h2>Meus Endereços</h2>
      {enderecos.length === 0 ? <p>Nenhum endereço encontrado.</p> : (
        enderecos.map((end) => {
          const idEnd = end.id || end.id_endereco;
          return (
            <div key={idEnd} style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "8px", marginBottom: "15px", backgroundColor: "#eae6e5" }}>
              
              {editando?.idItem === idEnd && editando?.tabela === "Endereco" && (
                <form onSubmit={salvarEdicao} style={{ backgroundColor: "#fff", padding: "15px", borderRadius: "8px", marginBottom: "15px", border: "2px solid #007bff" }}>
                  <h4 style={{ margin: "0 0 10px 0" }}>Alterando: {editando.nomeExibicao}</h4>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input type="text" value={novoValor} onChange={(e) => setNovoValor(e.target.value)} style={{ flex: 1, padding: "8px" }} autoFocus />
                    <button type="submit" style={{ backgroundColor: "#28a745", color: "white", padding: "8px 15px", border: "none", borderRadius: "4px" }}>Salvar</button>
                    <button type="button" onClick={() => setEditando(null)} style={{ backgroundColor: "#dc3545", color: "white", padding: "8px 15px", border: "none", borderRadius: "4px" }}>Cancelar</button>
                  </div>
                </form>
              )}

              {confirmarRemocao?.id === idEnd && confirmarRemocao?.tabela === "Endereco" && (
                <div style={{ backgroundColor: "#ffebee", padding: "15px", borderRadius: "8px", marginBottom: "15px", border: "2px solid #f44336" }}>
                  <p style={{ color: "#d32f2f", margin: "0 0 10px 0" }}><strong>Deseja mesmo excluir este endereço?</strong></p>
                  <button onClick={() => executarRemocao(idEnd, "Endereco")} style={{ backgroundColor: "#d32f2f", color: "white", padding: "5px 10px", border: "none", borderRadius: "4px", marginRight: "10px", cursor: "pointer" }}>Sim, Excluir</button>
                  <button onClick={() => setConfirmarRemocao(null)} style={{ padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}>Cancelar</button>
                </div>
              )}

              <p><strong>Rua:</strong> {end.rua}, {end.numero} {end.complemento && ` - ${end.complemento}`}</p>
              <p><strong>Bairro:</strong> {end.bairro} | <strong>Cidade:</strong> {end.cidade} - {end.estado}</p>
              
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "10px" }}>
                <button onClick={() => iniciarEdicao("Endereco", idEnd, "rua", "Rua", end.rua)}>Alterar Rua</button>
                <button onClick={() => iniciarEdicao("Endereco", idEnd, "numero", "Número", end.numero)}>Alterar Nº</button>
                <button onClick={() => iniciarEdicao("Endereco", idEnd, "complemento", "Complemento", end.complemento)}>Alterar Compl.</button>
                <button onClick={() => iniciarEdicao("Endereco", idEnd, "bairro", "Bairro", end.bairro)}>Alterar Bairro</button>
                <button onClick={() => iniciarEdicao("Endereco", idEnd, "cidade", "Cidade", end.cidade)}>Alterar Cidade</button>
                <button onClick={() => iniciarEdicao("Endereco", idEnd, "estado", "Estado", end.estado)}>Alterar Estado</button>
                <button onClick={() => { setConfirmarRemocao({ id: idEnd, tabela: "Endereco" }); setEditando(null); }} style={{ backgroundColor: "#dc3545", color: "white", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}>Excluir Endereço</button>
              </div>
            </div>
          )
        })
      )}

      <hr style={{ margin: "30px 0" }} />

      {/* LISTA DE TELEFONES */}
      <h2>Meus Telefones</h2>
      {telefones.length === 0 ? <p>Nenhum telefone encontrado.</p> : (
        telefones.map((tel, index) => {
          const idTel = tel.id_telefone || index;
          return (
            <div key={idTel} style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "8px", marginBottom: "15px", backgroundColor: "#eae6e5" }}>
              
              {editando?.idItem === idTel && editando?.tabela === "Telefone" && (
                <form onSubmit={salvarEdicao} style={{ backgroundColor: "#fff", padding: "15px", borderRadius: "8px", marginBottom: "15px", border: "2px solid #007bff" }}>
                  <h4 style={{ margin: "0 0 10px 0" }}>Alterando: {editando.nomeExibicao}</h4>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input type="text" value={novoValor} onChange={(e) => setNovoValor(e.target.value)} style={{ flex: 1, padding: "8px" }} autoFocus />
                    <button type="submit" style={{ backgroundColor: "#28a745", color: "white", padding: "8px 15px", border: "none", borderRadius: "4px" }}>Salvar</button>
                    <button type="button" onClick={() => setEditando(null)} style={{ backgroundColor: "#dc3545", color: "white", padding: "8px 15px", border: "none", borderRadius: "4px" }}>Cancelar</button>
                  </div>
                </form>
              )}

              {confirmarRemocao?.id === idTel && confirmarRemocao?.tabela === "Telefone" && (
                <div style={{ backgroundColor: "#ffebee", padding: "15px", borderRadius: "8px", marginBottom: "15px", border: "2px solid #f44336" }}>
                  <p style={{ color: "#d32f2f", margin: "0 0 10px 0" }}><strong>Deseja mesmo excluir este telefone?</strong></p>
                  <button onClick={() => executarRemocao(idTel, "Telefone")} style={{ backgroundColor: "#d32f2f", color: "white", padding: "5px 10px", border: "none", borderRadius: "4px", marginRight: "10px", cursor: "pointer" }}>Sim, Excluir</button>
                  <button onClick={() => setConfirmarRemocao(null)} style={{ padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}>Cancelar</button>
                </div>
              )}

              <p><strong>Tipo:</strong> {tel.tipo} | <strong>Número:</strong> {tel.numero}</p>
              
              <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                <button onClick={() => iniciarEdicao("Telefone", idTel, "tipo", "Tipo", tel.tipo)}>Alterar Tipo</button>
                <button onClick={() => iniciarEdicao("Telefone", idTel, "numero", "Número", tel.numero)}>Alterar Número</button>
                <button onClick={() => { setConfirmarRemocao({ id: idTel, tabela: "Telefone" }); setEditando(null); }} style={{ backgroundColor: "#dc3545", color: "white", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}>Excluir Telefone</button>
              </div>
            </div>
          )
        })
      )}
    </div>
  );
}

export default DadosContato;