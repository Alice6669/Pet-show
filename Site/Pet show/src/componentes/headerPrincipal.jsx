import React from 'react'
import {Link} from "react-router-dom"
import { NavLink } from "react-router-dom"
import "./headerPrincipal.css"

const HeaderPrincipal = ({ carrinho = [] }) => {
  
  return (
    <div className='conteinerHeader'>
        <img src="../public/logo.png" alt="Uma pata laranja com o desenho de um gato e um cachorro, é a logo" id='logo'/>
        <div className="textLogo">
          <h1>Show Pets</h1>
          <p>Cuidado e carinho para o seu melhor amigo</p>
        </div>
        <NavLink to="home" className={({isActive}) => (isActive ? "ativo" : "")} id='link'>Home</NavLink>
        <NavLink to="contato" className={({isActive}) => (isActive ? "ativo" : "")} id='link' >Contato</NavLink>
        <NavLink to="blog" className={({isActive}) => (isActive ? "ativo" : "")} id='link' >Blog</NavLink>
        <NavLink to="sobre" className={({isActive}) => (isActive ? "ativo" : "")} id='link' >Sobre</NavLink>
        <NavLink to="minhaConta" className={({isActive}) => (isActive ? "ativo" : "")} id='link' >Conta</NavLink>
        <NavLink to="carrinho" className={({isActive}) => (isActive ? "ativo" : "")} id='link'>
          {/* Criamos uma div em volta do ícone para posicionar a bolinha corretamente */}
          <div className="icone-carrinho-container">
            <img src="../public/carrinho.png" alt="Carrinho de compras" id='carrinho'/>
            
            {/* A bolinha só aparece se a quantidade for maior que zero */}
            {carrinho.length > 0 && (
              <span className="bolinha-carrinho">{carrinho.length}</span>
            )}
          </div>
        </NavLink>

    </div>
  )
}

export default HeaderPrincipal