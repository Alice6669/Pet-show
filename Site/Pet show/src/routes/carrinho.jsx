import { useState, useEffect } from "react";
import "./carrinho.css";
import { useOutletContext, useNavigate } from "react-router-dom";

const Carrinho = () => {
  const [tela, setTela] = useState("carrinho");
  const { carrinho, setCarrinho } = useOutletContext();
  const navigate = useNavigate();
  
  // Pega as informações do usuário logado do LocalStorage
  const usuarioAtual = JSON.parse(localStorage.getItem("Pessoa"));
  const idCliente = usuarioAtual ? (usuarioAtual.id_pessoa || usuarioAtual.id) : null;

  // Estados para os endereços e telefones no checkout
  const [enderecos, setEnderecos] = useState([]);
  const [telefones, setTelefones] = useState([]);
  const [enderecoSelecionado, setEnderecoSelecionado] = useState("");
  const [telefoneSelecionado, setTelefoneSelecionado] = useState("");

  // Carrega o carrinho quando o componente monta
  useEffect(() => {
    if (idCliente) {
      carregarCarrinhoDoBanco();
    }
  }, [idCliente]);

  // Carrega os endereços e telefones quando o usuário vai para a tela de checkout
  useEffect(() => {
    if (tela === "checkout" && idCliente) {
      carregarDadosContato();
    }
  }, [tela, idCliente]);

  const carregarCarrinhoDoBanco = async () => {
    try {
      const res = await fetch(`http://localhost:3000/Carrinho/${idCliente}`);
      if (res.ok) {
        const data = await res.json();
        setCarrinho(data);
      }
    } catch (error) {
      console.error("Erro ao carregar o carrinho do banco:", error);
    }
  };

  const carregarDadosContato = async () => {
    try {
      // Busca Endereços
      const resEnd = await fetch(`http://localhost:3000/Endereco/Pessoa/${idCliente}`);
      if (resEnd.ok) {
        const dataEnd = await resEnd.json();
        const arrayEnd = Array.isArray(dataEnd) ? dataEnd : [dataEnd];
        setEnderecos(arrayEnd);
        // Já deixa o primeiro endereço pré-selecionado, se existir
        if (arrayEnd.length > 0) setEnderecoSelecionado(arrayEnd[0].id || arrayEnd[0].id_endereco);
      }

      // Busca Telefones
      const resTel = await fetch(`http://localhost:3000/Telefone/Pessoa/${idCliente}`);
      if (resTel.ok) {
        const dataTel = await resTel.json();
        const arrayTel = Array.isArray(dataTel) ? dataTel : [dataTel];
        setTelefones(arrayTel);
        // Já deixa o primeiro telefone pré-selecionado, se existir
        if (arrayTel.length > 0) setTelefoneSelecionado(arrayTel[0].id_telefone || arrayTel[0].numero);
      }
    } catch (error) {
      console.error("Erro ao carregar dados de contato:", error);
    }
  };

  // 1. Calcula o Total Original (Sem nenhum desconto)
  const totalOriginal = carrinho.reduce((acc, item) => acc + item.preco, 0);

  // 2. Calcula o Total Final (Aplicando as promoções)
  const total = carrinho.reduce((acc, item) => {
    const precoFinal = item.promocao > 0 ? item.preco * ((100 - item.promocao) / 100) : item.preco;
    return acc + precoFinal;
  }, 0);

  const removerDoCarrinho = async (indexParaRemover, id_cliente_produto) => {
    if (id_cliente_produto) {
      try {
        await fetch(`http://localhost:3000/Carrinho/Item/${id_cliente_produto}`, {
          method: "DELETE",
        });
      } catch (error) {
        console.error("Erro ao remover do banco:", error);
      }
    }
    const novoCarrinho = carrinho.filter((_, index) => index !== indexParaRemover);
    setCarrinho(novoCarrinho);
  };

  const finalizarCompra = async (e) => {
    e.preventDefault();
    
    // Validação de segurança: Impede a compra se não houver endereço ou telefone selecionado
    if (!enderecoSelecionado || !telefoneSelecionado) {
      alert("Por favor, selecione um endereço e um telefone para entrega.");
      return;
    }

    if (idCliente) {
      try {
        await fetch(`http://localhost:3000/Carrinho/Limpar/${idCliente}`, {
          method: "DELETE",
        });
      } catch (error) {
        console.error("Erro ao limpar carrinho do banco:", error);
      }
    }
    setCarrinho([]);
    setTela("sucesso");
  };

  return (
    <div className="loja-container">
      <h1 className="carinhoTitulos">ShowPets - Carrinho</h1>

      {tela === "carrinho" && (
        <>
          <div className="box-carrinho">
            <h3 className="carinhoTitulos">Carrinho de Compras ({carrinho.length} itens)</h3>

            {carrinho.length === 0 ? (
              <p>Seu carrinho está vazio.</p>
            ) : (
              <>
                <ul className="lista-carrinho">
                  {carrinho.map((item, index) => (
                    <li key={index} className="item-carrinho" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      
                      <div className="nomeProduto">
                        <p style={{ margin: "0px 0 5px 0" }}>{item.nome}</p>
                        
                        {item.promocao > 0 ? (
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <span style={{ color: "#dc3545", textDecoration: "line-through", fontSize: "0.85em" }}>
                              De: R$ {item.preco.toFixed(2).replace(".", ",")}
                            </span>
                            <strong >
                              Por: R$ {((item.preco * ((100 - item.promocao) / 100)).toFixed(2)).replace(".", ",")}
                            </strong>
                          </div>
                        ) : (
                          <strong >R$ {item.preco.toFixed(2).replace(".", ",")}</strong>
                        )}
                      </div>

                      <button className="btn-remover" onClick={() => removerDoCarrinho(index, item.id_cliente_produto)}>
                        Remover
                      </button>
                    </li>
                  ))}
                </ul>

                <div style={{ textAlign: "right", margin: "20px 0", padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
                  {totalOriginal > total && (
                    <h4 style={{ color: "#dc3545", textDecoration: "line-through", margin: "0 0 5px 0", fontWeight: "normal" }}>
                      Total s/ desconto: R$ {totalOriginal.toFixed(2).replace(".", ",")}
                    </h4>
                  )}
                  <h2 className="carinhoTitulos" style={{ margin: "0", color: "#28a745" }}>
                    Total Final: R$ {total.toFixed(2).replace(".", ",")}
                  </h2>
                </div>

                <button className="btn-checkout" onClick={() => setTela("checkout")}>
                  Ir para Checkout
                </button>
              </>
            )}
          </div>
        </>
      )}

      {/* TELA CHECKOUT */}
      {tela === "checkout" && (
        <div className="box-checkout">
          <h2 className="carinhoTitulos">Finalizar Pedido</h2>
          
          <div style={{ backgroundColor: "#f8f9fa", padding: "10px", borderRadius: "5px", marginBottom: "15px" }}>
            <p style={{ margin: "0" }}>Resumo: {carrinho.length} itens</p>
            {totalOriginal > total && (
              <p style={{ margin: "5px 0 0 0", color: "#dc3545", textDecoration: "line-through", fontSize: "0.9em" }}>
                Valor original: R$ {totalOriginal.toFixed(2).replace(".", ",")}
              </p>
            )}
            <h3 style={{ margin: "5px 0 0 0", color: "#28a745" }}>
              Total a pagar: R$ {total.toFixed(2).replace(".", ",")}
            </h3>
          </div>

          <form onSubmit={finalizarCompra}>
            <div className="form-group">
              <label>Nome Completo (Destinatário)</label>
              <input type="text" className="input-form" defaultValue={usuarioAtual?.nome} required />
            </div>

            {/* CAIXA DE ENDEREÇO COM BOTÃO PARA GERENCIAR */}
            <div className="form-group">
              <label>Endereço de Entrega</label>
              {enderecos.length > 0 ? (
                <select 
                  className="input-form" 
                  value={enderecoSelecionado} 
                  onChange={(e) => setEnderecoSelecionado(e.target.value)} 
                  required
                >
                  <option value="" disabled>Selecione onde deseja receber...</option>
                  {enderecos.map((end) => (
                    <option key={end.id || end.id_endereco} value={end.id || end.id_endereco}>
                      {end.rua}, {end.numero} {end.complemento ? `(${end.complemento})` : ""} - {end.bairro}, {end.cidade}/{end.estado}
                    </option>
                  ))}
                </select>
              ) : (
                <p style={{ color: "#dc3545", margin: "5px 0" }}>Nenhum endereço cadastrado.</p>
              )}
              
              <button 
                type="button" 
                onClick={() => navigate("/dadosContato")} 
                style={{ marginTop: "5px", backgroundColor: "#17a2b8", color: "white", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontSize: "0.9em" }}
              >
                + Gerenciar Endereços
              </button>
            </div>

            {/* CAIXA DE TELEFONE COM BOTÃO PARA GERENCIAR */}
            <div className="form-group">
              <label>Telefone de Contato</label>
              {telefones.length > 0 ? (
                <select 
                  className="input-form" 
                  value={telefoneSelecionado} 
                  onChange={(e) => setTelefoneSelecionado(e.target.value)} 
                  required
                >
                  <option value="" disabled>Selecione um número de contato...</option>
                  {telefones.map((tel, index) => (
                    <option key={tel.id_telefone || index} value={tel.id_telefone || tel.numero}>
                      [{tel.tipo}] {tel.numero}
                    </option>
                  ))}
                </select>
              ) : (
                <p style={{ color: "#dc3545", margin: "5px 0" }}>Nenhum telefone cadastrado.</p>
              )}

              <button 
                type="button" 
                onClick={() => navigate("/dadosContato")} 
                style={{ marginTop: "5px", backgroundColor: "#17a2b8", color: "white", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontSize: "0.9em" }}
              >
                + Gerenciar Telefones
              </button>
            </div>

            <div className="form-group">
              <label>Forma de Pagamento</label>
              <select className="input-form" required>
                <option value="credito">Cartão de Crédito</option>
                <option value="debito">Cartão de Débito</option>
                <option value="pix">Pix</option>
                <option value="boleto">Boleto</option>
              </select>
            </div>

            <button type="submit" className="btn-confirmar">Confirmar Pedido</button>
            <button type="button" className="btn-voltar" onClick={() => setTela("carrinho")}>
              Voltar ao Carrinho
            </button>
          </form>
        </div>
      )}

      {/* TELA DE SUCESSO */}
      {tela === "sucesso" && (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h1 className="carinhoTitulos" style={{ color: "#28a745" }}>🎉 Compra Realizada!</h1>
          <p>Obrigado por comprar na ShowPets.</p>

          <button className="btn-voltar" style={{ width: "auto", marginTop: "15px" }} onClick={() => setTela("carrinho")}>
            Voltar ao Carrinho
          </button>
        </div>
      )}
    </div>
  );
}

export default Carrinho;