import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from "../hooks/useFetch";
import './Cadastro.css';

const url = "http://localhost:3000/Pessoa";

function Cadastro() {
  const { data: lista } = useFetch(url);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [endereco, setEndereco] = useState({
    estado: "", cidade: "", bairro: "", rua: "", numero: "", complemento: ""
  });

  const [telefone, setTelefone] = useState({
    tipo: "CEL", numero: ""
  });

  // ESTADO PARA NOTIFICAÇÕES INLINE DO SITE
  const [notificacao, setNotificacao] = useState(null);

  // Função auxiliar para disparar a mensagem
  const mostrarMensagem = (texto, tipo = "sucesso") => {
    setNotificacao({ texto, tipo });
    setTimeout(() => setNotificacao(null), 4000); // Some após 4 segundos
  };

  const handleCadastro = async (e) => {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      mostrarMensagem("As senhas não coincidem!", "erro");
      return;
    }

    if (!lista) {
      mostrarMensagem("Aguarde os dados carregarem.", "erro");
      return;
    }

    const nomeExiste = lista.find((u) => u.nome === nome);
    const emailExiste = lista.find((u) => u.email === email);

    if (nomeExiste) {
      mostrarMensagem("Nome de usuário já existe! Escolha outro.", "erro");
      return;
    }

    if (emailExiste) {
      mostrarMensagem("Email já cadastrado!", "erro");
      return;
    }

    const novoUsuario = { nome, email, senha };

    try {
      // 1. Cadastra Pessoa
      const respPessoa = await fetch("http://localhost:3000/Pessoa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoUsuario),
      });

      if (!respPessoa.ok) {
        mostrarMensagem("Erro ao cadastrar usuário.", "erro");
        return;
      }

      const pessoaCadastrada = await respPessoa.json();
      const idPessoa = pessoaCadastrada.id_pessoa || pessoaCadastrada.id;

      // 2. Cadastra Endereço
      const enderecoComPessoa = { ...endereco, id_fk_pessoa: idPessoa };
      const respEndereco = await fetch("http://localhost:3000/Endereco", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enderecoComPessoa),
      });

      if (!respEndereco.ok) {
        mostrarMensagem("Usuário cadastrado, mas houve erro ao salvar endereço.", "erro");
        return;
      }

      // 3. Cadastra Telefone
      const telefoneComPessoa = { ...telefone, id_fk_pessoa: idPessoa };
      const respTelefone = await fetch("http://localhost:3000/Telefone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(telefoneComPessoa),
      });

      if (!respTelefone.ok) {
        mostrarMensagem("Usuário e endereço cadastrados, mas houve erro ao salvar telefone.", "erro");
        return;
      }

      mostrarMensagem("Usuário cadastrado com sucesso!", "sucesso");

      // Limpa os formulários
      setNome(""); setEmail(""); setSenha(""); setConfirmarSenha("");
      setEndereco({ estado: "", cidade: "", bairro: "", rua: "", numero: "", complemento: "" });
      setTelefone({ tipo: "CEL", numero: "" });

    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      mostrarMensagem("Erro ao realizar cadastro.", "erro");
    }
  };

  const alterarEndereco = (e) => {
    const { name, value } = e.target;
    setEndereco((prev) => ({ ...prev, [name]: value }));
  };

  const alterarTelefone = (e) => {
    const { name, value } = e.target;
    setTelefone((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="page" style={{ position: "relative" }}>
      
      {/* NOTIFICAÇÃO DO PRÓPRIO SITE */}
      {notificacao && (
        <div style={{
          position: "fixed", top: "20px", right: "20px", padding: "15px 25px", borderRadius: "5px", zIndex: 1000, color: "white", fontWeight: "bold", boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
          backgroundColor: notificacao.tipo === "sucesso" ? "#28a745" : "#dc3545"
        }}>
          {notificacao.texto}
        </div>
      )}

      <div id='container-forms'>
        <form className='formCadastroLogin' onSubmit={handleCadastro}>
          <h1>Cadastro de Usuários</h1>
          
          <input placeholder='Nome de Usuário' name='nome' value={nome} onChange={(e) => setNome(e.target.value)} type='text' required />
          <input placeholder='Email' name='email' value={email} onChange={(e) => setEmail(e.target.value)} type='email' required />
          <input placeholder='Senha' name="senha" value={senha} onChange={(e) => setSenha(e.target.value)} type="password" required />
          <input placeholder='Confirmar Senha' name="confirmarSenha" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} type='password' required />
          
          <h2>Endereço</h2>
          <input type="text" name="estado" placeholder="Estado" value={endereco.estado} onChange={alterarEndereco} required />
          <input type="text" name="cidade" placeholder="Cidade" value={endereco.cidade} onChange={alterarEndereco} required />
          <input type="text" name="bairro" placeholder="Bairro" value={endereco.bairro} onChange={alterarEndereco} required />
          <input type="text" name="rua" placeholder="Rua" value={endereco.rua} onChange={alterarEndereco} required />
          <input type="number" name="numero" placeholder="Número" value={endereco.numero} onChange={alterarEndereco} required />
          <input type="text" name="complemento" placeholder="Complemento" value={endereco.complemento} onChange={alterarEndereco} />

          <h2>Telefone</h2>
          <select name="tipo" value={telefone.tipo} onChange={alterarTelefone}>
            <option value="CEL">Celular</option>
            <option value="TEL">Telefone</option>
            <option value="COM">Comercial</option>
          </select>
          <input type="text" name="numero" placeholder="Número de telefone" value={telefone.numero} onChange={alterarTelefone} required />
          
          <button type='submit'>Cadastrar</button>
          <Link to={'/login'} id='Link'>Entrar</Link>
        </form>
      </div>
    </div>
  );
}

export default Cadastro;