import React from 'react';
import { Secao } from './elementos/basicos/Secao';
import { CabeçalhoDeSecao } from './elementos/basicos/CabecalhoDeSecao';
import { CabecalhoPrincipal } from './elementos/basicos/CabecalhoPrincipal';
import { CampoDeSecao } from './elementos/basicos/CampoDeSecao';

export default function Home() {
  return (
    <main>
      <Secao>
        <CabeçalhoDeSecao titulo="Texto de cabeçalho de seção" />
        <CabecalhoPrincipal titulo="Texto de cabeçalho principal" />
        <h1>Olá, mundo!</h1>
        <CampoDeSecao titulo="Texto de campo de seção" complemento="Texto de complemento de campo de seção" variante="horizontal" />
        <CampoDeSecao titulo="Texto de campo de seção" complemento="Texto de complemento de campo de seção" variante="vertical" />
        <CampoDeSecao titulo="Texto de campo de seção" complemento="Texto de complemento de campo de seção" variante="horizontal-com-badge" />
      </Secao>
    </main>
  );
}