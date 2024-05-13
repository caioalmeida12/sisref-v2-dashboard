import React from 'react';
import { Aviso } from '@/app/elementos/modulos/Aviso';
import { InformacoesDeEstudante } from '@/app/elementos/modulos/InformacoesDeEstudante';

export default async function Home() {
  return (
    <>
      <InformacoesDeEstudante />
      <Aviso titulo='Aviso' texto='Você possui uma refeição pendente. Por favor, vá até a cantina para retirá-la.' />
    </>
  );
}