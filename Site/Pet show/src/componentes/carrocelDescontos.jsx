import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import "./carrocelDescontos.css";

const url = "http://localhost:3000/Produto";

const CarrocelDescontos = () => {
  const { data: items, loading, error } = useFetch(url);
  const [start, setStart] = useState(0);
  
  // NOVO: Estado para saber para qual lado a animação deve ir
  const [direcao, setDirecao] = useState("right"); 

  // Filtramos os produtos primeiro
  const produtosPromocao = items ? items.filter(item => item.promocao > 1) : [];
  const totalItens = produtosPromocao.length;

  const passarEsquerda = () => {
    setDirecao("left");
    setStart((prevStart) => (prevStart - 1 + totalItens) % totalItens);
  };

  const passarDireita = () => {
    setDirecao("right");
    setStart((prevStart) => (prevStart + 1) % totalItens);
  };

  // NOVO: useEffect para escutar as setas do teclado
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Se tiver 3 itens ou menos, o carrossel não precisa rodar
      if (totalItens <= 3) return;

      if (event.key === "ArrowLeft") {
        passarEsquerda();
      } else if (event.key === "ArrowRight") {
        passarDireita();
      }
    };

    // Adiciona o "escutador" quando o componente aparece na tela
    window.addEventListener("keydown", handleKeyDown);

    // Remove o "escutador" quando o usuário sai da página (limpeza de memória)
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [totalItens]); // Atualiza o evento caso a quantidade de itens mude

  const getItensVisiveis = () => {
    if (totalItens === 0) return [];
    if (totalItens <= 3) return produtosPromocao;

    return [
      produtosPromocao[start % totalItens],
      produtosPromocao[(start + 1) % totalItens],
      produtosPromocao[(start + 2) % totalItens],
    ];
  };

  if (loading) return <p>Carregando promoções...</p>;
  if (error) return <p>Erro ao carregar promoções.</p>;
  if (!items) return null;

  return (
    <div className='carrocelDescontos'>
      <button className='passador' onClick={passarEsquerda} disabled={totalItens <= 3}>
        <img src="/setaLeft.png" alt="Seta para esquerda" />
      </button>
      
      {/* O TRUQUE DA ANIMAÇÃO ESTÁ AQUI: 
        1. Colocamos a classe dinâmica animar-left ou animar-right.
        2. Usamos o key={start}. Sempre que o "start" muda, o React recria essa <ul> do zero, disparando a animação CSS novamente.
      */}
      <ul className={`produtos animar-${direcao}`} key={start}>
        {getItensVisiveis().map((item) => {
          const idAtual = item.id_produto || item.id;

          return (
            <li className="produtosCarrocel" key={idAtual}>
              <img src={item.imagens} alt={item.descricao} />
              <h2 className='nome'>{item.nome}</h2>
              <p className='preco'>
                <span className='promocao'>R$: {item.preco.toFixed(2)}</span> 
                R$: {(item.preco * ((100 - item.promocao) / 100)).toFixed(2)}
              </p>
              <Link to={`/produtos/${idAtual}`} className='button'>
                Detalhes
              </Link>
            </li>
          );
        })}
      </ul>
      
      <button className='passador' onClick={passarDireita} disabled={totalItens <= 3}>
        <img src="/setaRight.png" alt="Seta para direita" />
      </button>
    </div>
  );
};

export default CarrocelDescontos;