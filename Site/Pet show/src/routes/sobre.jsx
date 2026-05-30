import "./sobre.css"

const Sobre = () =>{
  return (
    <div className="conteinerSobre" >
      <h2 id="tituloSobre">Sobre Nós</h2>

      <img 
        src="https://img.freepik.com/fotos-gratis/cao-adoravel-com-dono-na-pet-shop_23-2148872556.jpg?semt=ais_hybrid&w=740&q=80"
        id="imagemSobre"
        alt="Ambiente de pet shop com produtos organizados"
      />

      <main id="sobre">
        <p className="lead">
        A ShowPets surgiu com o propósito de oferecer aos tutores um ambiente especializado, onde 
        cuidado, confiança e responsabilidade caminham lado a lado. Nossa seleção de produtos reflete 
        um compromisso rigoroso com qualidade, segurança e bem-estar.
      </p>

      <h4 className="mt-4">Nossa História</h4>
      <p>
        Criada por profissionais apaixonados por comportamento e saúde animal, a ShowPets nasceu da 
        necessidade de unir atendimento acolhedor, orientação qualificada e produtos realmente confiáveis. 
        Com o tempo, ampliamos nosso portfólio, aprimoramos processos e consolidamos uma cultura 
        voltada à excelência no atendimento.
      </p>

      <h4 className="mt-4">Missão</h4>
      <p>
        Oferecer soluções completas que promovam qualidade de vida, saúde e conforto aos animais.
      </p>

      <h4 className="mt-4">Visão</h4>
      <p>
        Ser reconhecida como referência em experiência do cliente no segmento pet.
      </p>

      <h4 className="mt-4">Valores</h4>
      <div id="ulConteiner">
        <ul>
        <li>Respeito e cuidado integral com todos os animais</li>
        <li>Transparência e responsabilidade no atendimento</li>
        <li>Rigor na seleção de produtos e fornecedores</li>
        <li>Ética, compromisso e acolhimento</li>
      </ul>
      </div>
      </main>
    </div>
  );
}

export default Sobre;