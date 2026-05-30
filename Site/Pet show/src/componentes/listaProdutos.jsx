import React, { useState } from 'react';
import Busca from './busca';
import { useFetch } from "../hooks/useFetch";
import { Link } from "react-router-dom";
import "./listaProdutos.css";

const url = "http://localhost:3000/Produto";

const ListaProdutos = () => {
  const { data: items, loading, error } = useFetch(url);
  const [filteredItems, setFilteredItems] = useState(null);
  const [animal, setAnimal] = useState("");
  const [classe, setClasse] = useState("");

  if (loading) return <p>Carregando produtos...</p>;
  if (error) return <p>Erro ao carregar produtos</p>;
  if (!items) return null;

  const produtosParaExibir = items
    .filter(item => !animal || item.animal === animal)
    .filter(item => !classe || item.classe === classe)
    .filter(item =>
      !filteredItems || filteredItems.some(f => f.id === item.id)
    );

  return (
    <div>
      <Busca items={items} setFilteredItems={setFilteredItems} />
      <h2>Categorias:</h2>
      <form id='categoriasAnimalConteiner'>
        <p>Animais:</p>
        <label className="categoriasAnimal">
          <input type="radio" value="cachorro" name='categoriasAnimal' checked={animal === "cachorro"}
            onChange={(e) => setAnimal(e.target.value)} />
          <p>Cachorro</p>
        </label>
        <label className="categoriasAnimal">
          <input type="radio" value="gato" name='categoriasAnimal' checked={animal === "gato"}
            onChange={(e) => setAnimal(e.target.value)} />
          <p>Gato</p>
        </label>
        <label className="categoriasAnimal">
          <input type="radio" value="passaro" name='categoriasAnimal' checked={animal === "passaro"}
            onChange={(e) => setAnimal(e.target.value)} />
          <p>Passaro</p>
        </label>
        <label className="categoriasAnimal">
          <input type="radio" value="reptil" name='categoriasAnimal' checked={animal === "reptil"}
            onChange={(e) => setAnimal(e.target.value)} />
          <p>Reptil</p>
        </label>
        <label className="categoriasAnimal">
          <input type="radio" value="peixe" name='categoriasAnimal' checked={animal === "peixe"}
            onChange={(e) => setAnimal(e.target.value)} />
          <p>Peixe</p>
        </label>
        <label className="categoriasAnimal">
          <input type="radio" value="" name='categoriasAnimal' checked={animal === ""}
            onChange={(e) => setAnimal("")} />
          <p>Todos</p>
        </label>
      </form>

      <form id='categoriasClasseConteiner'>
        <p>Classes:</p>
        <label className="categoriasClasse">
          <input type="radio" value="comida" name='categoriasClasse' checked={classe === "comida"}
            onChange={(e) => setClasse(e.target.value)} />
          <p>Comida</p>
        </label>
        <label className="categoriasClasse">
          <input type="radio" value="casa" name='categoriasClasse' checked={classe === "casa"}
            onChange={(e) => setClasse(e.target.value)} />
          <p>Casa</p>
        </label>
        <label className="categoriasClasse">
          <input type="radio" value="brinquedo" name='categoriasClasse' checked={classe === "brinquedo"}
            onChange={(e) => setClasse(e.target.value)} />
          <p>Brinquedo</p>
        </label>
        <label className="categoriasClasse">
          <input type="radio" value="" name='categoriasClasse' checked={classe === ""}
            onChange={(e) => setClasse("")} />
          <p>Todos</p>
        </label>
      </form>

      <div className="produtosExpostos">
        {produtosParaExibir.map((item) => (
          <div key={item.id} className='listaProdutos'>
            <img src={item.imagens} alt={item.descricao} className='imgProdutos' />
            <h2 className='nome' >{item.nome}</h2>
            
            {/* O ID "promocao" FOI ADICIONADO AQUI */}
            {item.promocao > 0 ? (
              <p className='preco'>
                <span className='promocao'>R$: {item.preco.toFixed(2)}</span> R$: {(item.preco * ((100 - item.promocao) / 100)).toFixed(2)}
              </p>
            ) : (
              <p className='preco'>R$: {item.preco.toFixed(2)}</p>
            )}

            {/* rota dinamica */}
            <div className="botoes">
              <Link to={`/produtos/${item.id}`} className='button'>Detalhes</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListaProdutos;