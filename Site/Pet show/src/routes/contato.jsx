import React from 'react'
import "./contato.css"

const Contato = () => {
  return (
    <div className="conteinerContato" >
      <h2 className="text-center mb-4">Contato</h2>

      <p className="text-center mb-4" >
        A ShowPets disponibiliza canais oficiais de atendimento para dúvidas, suporte e informações gerais.
      </p>

      <div className="p-4 border rounded bg-light">
        <p className="mb-3">
          <strong>E-mail:</strong><br />
          showpetsoficial@gmail.com
        </p>

        <p className="mb-3">
          <strong>Telefone:</strong><br />
          (38) 9090-5030
        </p>

        <p className="mb-3">
          <strong>WhatsApp:</strong><br />
          (38) 98282-4520
        </p>

        <p className="mb-3">
          <strong>Horário de Atendimento:</strong><br />
          Segunda a Sexta, das 08h às 18h
        </p>

        <p className="mb-0">
          <strong>Endereço:</strong><br />
          Rua Capitão Marcelo, 1080 – Centro, Belo Horizonte – MG
        </p>
      </div>
    </div>
  );
}

export default Contato