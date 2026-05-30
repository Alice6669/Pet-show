import React from 'react'
import { useFetch } from "../hooks/useFetch";
const url = "http://localhost:3000/Produto";
import { Link } from "react-router-dom";
import CarrocelDescontos from '../componentes/carrocelDescontos';
import "./home.css"
import ListaProdutos from '../componentes/listaProdutos';

const Home = () => {
    const { data: items, loading, error } = useFetch(url);
  return (
    <div>
      <h1 id='promocaoTitulo'>Promoções</h1>
      <CarrocelDescontos />
      <ListaProdutos />
    </div>
  )
}

export default Home