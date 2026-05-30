//const url = "http://localhost:3000/Pessoa";
import { useFetch } from "../hooks/useFetch";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import "./Login.css"
import { UserContext } from "../componentes/userContext";
import { useContext } from "react";


function Login() {

  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo, setTipo] = useState("");
  //const { data: lista, loading, error } = useFetch(url);

  const { setUsuario } = useContext(UserContext);

  /*const handleLogin = async (e) => {
    e.preventDefault();

    const usuario = lista?.find(
    (u) => u.email.trim() === email.trim() && u.senha === senha && u.nome === nome);

    console.log(lista)

    if (usuario) {
      localStorage.setItem("Pessoa", JSON.stringify(usuario));
      setUsuario(usuario);
      navigate("/home")
    } else {
      alert("Email ou senha incorretos!");
    }
  }*/
  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:3000/Login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        senha,
        tipo
      }),
    });

    const data = await response.json();

    /*if (response.ok) {
      const usuario = data.usuario;

      localStorage.setItem("Pessoa", JSON.stringify(usuario));
      setUsuario(usuario);
      

      navigate("/home");*/

    if (response.ok) {
      const usuario = data.usuario;

      if (usuario.email === "italo@gmail.com") {
        usuario.tipo = "fornecedor";
      }

      localStorage.setItem("Pessoa", JSON.stringify(usuario));
      setUsuario(usuario);

      navigate("/home");
     
    } else {
      alert(data.erro || "Email ou senha incorretos!");
    }
  } catch (error) {
    console.error(error);
    alert("Erro ao conectar com o servidor.");
  }
};

  return (
    <div className="page">

      
      <div id='container-forms'>
        <form className="formCadastroLogin">
          <h1>Login</h1>
          <input placeholder='Nome de Usuário' value={nome} type='text' onChange={(e) => setNome(e.target.value)} />
          <input placeholder='Email' value={email} type='email' onChange={(e) => setEmail(e.target.value)}/>
          <input placeholder='Senha' value={senha} type='password' onChange={(e) => setSenha(e.target.value)}/>
          <Link to={'/'} id="Link">Cadastrar</Link>
          <button type='button' onClick={handleLogin}>Entrar</button>
        </form>
      </div>
    </div>
  )
}

export default Login