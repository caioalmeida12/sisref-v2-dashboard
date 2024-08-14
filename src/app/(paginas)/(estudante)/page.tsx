import React from 'react';
import { Aviso } from '@/app/elementos/modulos/Aviso';
import { InformacoesDeEstudante } from '@/app/elementos/modulos/InformacoesDeEstudante';
import { fetchTicketsSemJustificativa } from '@/app/actions/fetchTicketsSemJustificativa';

export default async function Home() {

  const temTicketsSemJustificativa = await fetchTicketsSemJustificativa()

  return (
    <>
      <InformacoesDeEstudante />
      {
        temTicketsSemJustificativa.length ?
          <Aviso titulo='Aviso' texto='Você possui um ou mais tickets pendentes de justificativa. Por favor, acesse o histórico de refeições para regularizar sua situação.' />
          : null
      }
    </>
  );
}