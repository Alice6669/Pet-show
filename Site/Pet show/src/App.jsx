import { useState } from 'react'
import reactLogo from './assets/react.svg'
import Produtos from './routes/produtos.jsx';
import Carrinho from './routes/carrinho.jsx';
import './App.css'
import { Outlet } from "react-router-dom";
import HeaderPrincipal from './componentes/headerPrincipal';
import Footer from './componentes/footer';


function App() {
  const [count, setCount] = useState(0)
   const [carrinho, setCarrinho] = useState([]);

  // Função para adicionar item ao carrinho
  const adicionarAoCarrinho = (produto) => {
    setCarrinho([...carrinho, produto]);
  };

  return (
    <div className='conteiner'>
      <div className='conteiner'>
      <HeaderPrincipal carrinho={carrinho}/>

      <main>
        
        <Outlet context={{ carrinho, setCarrinho, adicionarAoCarrinho }} />
      </main>

      <Footer />
    </div>
    </div>
  )
}

export default App
