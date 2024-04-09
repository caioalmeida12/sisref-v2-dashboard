import React from 'react';
import { Secao } from './elementos/basicos/Secao';
import { CabeçalhoDeSecao } from './elementos/basicos/CabecalhoDeSecao';
import { CabecalhoPrincipal } from './elementos/basicos/CabecalhoPrincipal';

export default function Home() {
  return (
    <main>
      <Secao>
        <CabeçalhoDeSecao titulo="Texto de cabeçalho de seção" />
        <CabecalhoPrincipal titulo="Texto de cabeçalho principal" />
        <h1>Olá, mundo!</h1>
      </Secao>
    </main>
  );
}