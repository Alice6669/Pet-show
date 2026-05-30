import React from 'react'
import { useState } from "react";
import "./busca.css"

const Busca = ({ items, setFilteredItems }) => {

  
    const handleChange = (e) => {
        const query = e.target.value.toLowerCase();

      if (!items) return;
  
      const resultados = items.filter(item =>
      item.nome.toLowerCase().includes(query)
        );

        setFilteredItems(resultados);
    };
  
    return (
      <input
        type="text"
        onChange={handleChange}
        placeholder="Buscar produto"
        id='pesquisa'
        />
    );
}

export default Busca