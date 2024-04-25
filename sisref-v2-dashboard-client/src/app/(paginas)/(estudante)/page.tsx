import React from 'react';
import { Aviso } from '@/app/elementos/modulos/Aviso';

export default async function Home() {
  return (
    <>
      <Aviso titulo='Aviso' texto='Você possui uma refeição pendente. Por favor, vá até a cantina para retirá-la.' />
    </>
  );
}