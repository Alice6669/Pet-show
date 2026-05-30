import "./Blog.css"
import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import logo from "../imgs/logo.png";
import { Link } from 'react-router-dom';
import vacina from "../imgs/vacina.png";
import racao from "../imgs/racao.png";
import banho from "../imgs/banho.png";


function Blog() {

    return (
        <div className="page">
            
            <section id="titulo-blog">
                <h1>Seu Blog para cuidados com seu Pet </h1>
            </section>
        <div id="container-central">
            <section class="bloco-conteudo">
                <div class="texto">
                    <h2 id="titulotexto">A Ciência de um Banho Perfeito.<br/> 
                    <span class="cinza">Seu pet merece esse cuidado!</span></h2>
                    <p>Não é apenas sobre cheiro bom! A higiene regular, com produtos específicos e técnicas profissionais, evita problemas de pele, queda de pelos e desconforto. Agende o Banho & Tosa no nosso Pet Show e garanta um pet limpo, saudável e feliz.</p>
                </div>
                <div class="imagem">
                    <div class="placeholder-box">
                        <img src={banho} alt="Imagem de uma pet tomando banho" />
                    </div>
                </div>
            </section>
            <div class="divisor"></div>
            <section class="bloco-conteudo">
                <div class="texto">
                    <h2 id="titulotexto">Check-up e Vacinas em Dia.<br/> 
                    <span class="cinza">A melhor prova de amor!</span></h2>
                    <p>A prevenção é o segredo da longevidade. Mantenha a carteira de vacinação do seu amigo atualizada e realize visitas periódicas ao veterinário. Pequenos cuidados diários, como checar as orelhas e escovar os dentes, fazem toda a diferença.</p>
                </div>
                <div class="imagem">
                    <div class="placeholder-box">
                        <img src={vacina} id="vacina" alt="Vacinação de Pets" />
                    </div>
                </div>
            </section>
             <div class="divisor"></div>
             <section class="bloco-conteudo">
                <div class="texto">
                    <h2 id="titulotexto">Como Escolher a Ração Ideal.<br/> 
                    <span class="cinza">Nutrição que transforma a vida!</span></h2>
                    <p>A ração correta deve ser escolhida com base na idade, porte e nível de atividade do seu pet. Uma nutrição balanceada reflete diretamente na energia, na pelagem e na saúde intestinal. Venha conversar com nossos especialistas e descubra a melhor opção para seu companheiro.</p>
                </div>
                <div class="imagem">
                    <div class="placeholder-box">
                        <img src={racao} alt="imagem de ração de pet" />
                    </div>
                </div>
            </section>
            <div class="divisor"></div>
        </div>
        </div>
    )
}
export default Blog
