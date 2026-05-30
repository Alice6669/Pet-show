import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../componentes/userContext';
import { useFetch } from "../hooks/useFetch";
import { useNavigate } from 'react-router-dom';
import "./minhaConta.css";

const url = "http://localhost:3000/Pessoa";

const MinhaConta = () => {
  const { usuario, setUsuario } = useContext(UserContext);
  const { data: lista } = useFetch(url);
  const navigate = useNavigate();

  const pessoaSalva = JSON.parse(localStorage.getItem("Pessoa"));
  const usuarioAtual = usuario || pessoaSalva;

  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  // ESTADO PARA NOTIFICAÇÕES INLINE DO SITE
  const [notificacao, setNotificacao] = useState(null);

  useEffect(() => {
    if (!usuarioAtual) {
      navigate("/login");
    }
  }, [usuarioAtual, navigate]);

  // Função auxiliar para disparar a mensagem
  const mostrarMensagem = (texto, tipo = "sucesso") => {
    setNotificacao({ texto, tipo });
    setTimeout(() => setNotificacao(null), 4000); // Some após 4 segundos
  };

  const handleCadastro = async (e) => {
    e.preventDefault();

    if (!usuarioAtual) {
      mostrarMensagem("Usuário não encontrado. Faça login novamente.", "erro");
      return;
    }

    if (senha && senha !== confirmarSenha) {
      mostrarMensagem("As senhas não coincidem!", "erro");
      return;
    }

    if (nome && lista) {
      const nomeExiste = lista.find((u) => {
        const mesmoNome = u.nome === nome;
        const mesmoUsuario =
          u.id === usuarioAtual.id ||
          u.id_pessoa === usuarioAtual.id_pessoa;

        return mesmoNome && !mesmoUsuario;
      });

      if (nomeExiste) {
        mostrarMensagem("Nome de usuário já existe! Escolha outro.", "erro");
        return;
      }
    }

    const novoUsuario = {
      nome: nome || usuarioAtual.nome,
      email: usuarioAtual.email,
      senha: senha || usuarioAtual.senha
    };

    try {
      const resp = await fetch(`http://localhost:3000/Pessoa/${pessoaSalva.id_pessoa}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(novoUsuario)
      });

      if (!resp.ok) {
        mostrarMensagem("Erro ao alterar usuário. Verifique o servidor.", "erro");
        return;
      }

      const usuarioAtualizado = {
        ...usuarioAtual,
        ...novoUsuario
      };

      setUsuario(usuarioAtualizado);
      localStorage.setItem("Pessoa", JSON.stringify(usuarioAtualizado));

      setNome("");
      setSenha("");
      setConfirmarSenha("");

      mostrarMensagem("Dados de cadastro alterados com sucesso!", "sucesso");

    } catch (error) {
      console.error("Erro ao alterar cadastro:", error);
      mostrarMensagem("Erro ao alterar cadastro.", "erro");
    }
  };

  const sair = () => {
    setNome("");
    setSenha("");
    setConfirmarSenha("");

    setUsuario(null);

    localStorage.removeItem("Pessoa");
    localStorage.removeItem("usuario");

    navigate("/login");
  };

  if (!usuarioAtual) return null; // Evita piscar a tela antes do redirecionamento

  return (
    <div id="conteinerConta" style={{ position: "relative" }}>
      
      {/* NOTIFICAÇÃO DO PRÓPRIO SITE */}
      {notificacao && (
        <div style={{
          position: "fixed", top: "20px", right: "20px", padding: "15px 25px", borderRadius: "5px", zIndex: 1000, color: "white", fontWeight: "bold", boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
          backgroundColor: notificacao.tipo === "sucesso" ? "#28a745" : "#dc3545"
        }}>
          {notificacao.texto}
        </div>
      )}

      <h2 id="bemVindo">
        Bem-vindo, {usuarioAtual.nome}!
      </h2>

      <div className="page">
        <div id="container-forms">

          <form className="formCadastroLogin" onSubmit={handleCadastro}>
            <div className="blocoConta">
              <h1>Alterar dados</h1>

              <input
                placeholder="Nome de usuário novo"
                name="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                type="text"
              />

              <input
                placeholder="Email"
                name="email"
                value={usuarioAtual?.email || ""}
                type="email"
                disabled
              />

              <input
                placeholder="Senha nova"
                name="senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                type="password"
              />

              <input
                placeholder="Confirmar senha nova"
                name="confirmarSenha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                type="password"
              />

              <button 
                type="button" 
                onClick={() => navigate("/dadosContato")}
                style={{ backgroundColor: "#17a2b8", marginBottom: "10px" }}
              >
                Meus Dados de Contato
              </button>

              <button type="submit">Alterar dados</button>

              <button id="sairBtn" type="button" onClick={sair}>
                Sair
              </button>

              {usuarioAtual?.tipo?.trim().toLowerCase() === "fornecedor" && (
                <button
                  type="button"
                  onClick={() => navigate("/Fornecedor")}
                >
                  Área funcionário
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MinhaConta;