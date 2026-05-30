import React, { useState } from 'react';
import "./produtos.css";
import { useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { useOutletContext } from "react-router-dom";

const Produtos = () => {
    const { id } = useParams();
    const productId = Number(id);
    const url = `http://localhost:3000/Produto/${productId}`;
    const { data: item, loading, error } = useFetch(url);

    const { adicionarAoCarrinho } = useOutletContext();

    // ESTADO PARA NOTIFICAÇÕES INLINE DO SITE
    const [notificacao, setNotificacao] = useState(null);

    // Função auxiliar para disparar a mensagem
    const mostrarMensagem = (texto, tipo = "sucesso") => {
        setNotificacao({ texto, tipo });
        setTimeout(() => setNotificacao(null), 4000); // Some após 4 segundos
    };

    // Pega o usuário logado para saber quem está comprando
    const usuarioAtual = JSON.parse(localStorage.getItem("Pessoa"));
    const idCliente = usuarioAtual ? (usuarioAtual.id_pessoa || usuarioAtual.id) : null;

    const handleAdicionarClidado = async () => {
        if (!idCliente) {
            mostrarMensagem("Você precisa estar logado para adicionar itens ao carrinho!", "erro");
            return;
        }

        try {
            // 1. Salva no banco de dados
            const response = await fetch("http://localhost:3000/Carrinho", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_fk_produto: item.id, // O ID do produto que veio do useFetch
                    id_fk_cliente: idCliente // O ID do usuário logado
                })
            });

            if (response.ok) {
                const dadosResposta = await response.json();
                
                // 2. Adiciona o ID gerado pelo banco ao item para que a remoção funcione depois
                const itemComIdBanco = {
                    ...item,
                    id_cliente_produto: dadosResposta.id_cliente_produto
                };

                // 3. Atualiza o carrinho na tela do React
                adicionarAoCarrinho(itemComIdBanco);
                
                // 4. Exibe a mensagem de sucesso na tela
                mostrarMensagem("Produto adicionado ao carrinho com sucesso!", "sucesso");
            } else {
                mostrarMensagem("Erro ao adicionar o produto ao carrinho no servidor.", "erro");
            }
        } catch (error) {
            console.error("Erro na requisição do carrinho:", error);
            mostrarMensagem("Erro de conexão com o servidor.", "erro");
        }
    };

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>Erro ao carregar produto.</p>;
    if (!item) return <p>Produto não encontrado.</p>;

    return (
        <div id='conteinerProdutosEspecificos' style={{ position: "relative" }}>
            
            {/* NOTIFICAÇÃO DO PRÓPRIO SITE */}
            {notificacao && (
                <div style={{
                    position: "fixed", top: "20px", right: "20px", padding: "15px 25px", borderRadius: "5px", zIndex: 1000, color: "white", fontWeight: "bold", boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                    backgroundColor: notificacao.tipo === "sucesso" ? "#28a745" : "#dc3545"
                }}>
                    {notificacao.texto}
                </div>
            )}

            <h1 id='tituloProduto'>{item.nome}</h1>
            <div id="img"><img src={item.imagens} alt={item.descricao} /></div>
            <div id="preco">
                {item.promocao > 0 ? (
                    <p className='preco' >De: <span className="promocao">R$: {(item.preco).toFixed(2)}</span> Por:
                    R$: {(item.preco * ((100 - item.promocao) / 100)).toFixed(2)}</p>
                ) : (
                    <p className='preco'>R$: {(item.preco).toFixed(2)}</p>
                )}
            </div>
            <p>Quantidade disponível: {item.quantidadeDisponivel}</p>
            <p>Descrição: {item.descricao}</p>
            
            {/* Trocamos a chamada direta pelo nosso novo manipulador assíncrono */}
            <button id='adicionarCompra' onClick={handleAdicionarClidado}>
                Adicionar ao carrinho
            </button>
        </div>
    );
};

export default Produtos;