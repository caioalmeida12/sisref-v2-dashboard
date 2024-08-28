import React from 'react';
import { Aviso } from '@/app/elementos/modulos/Aviso';
import { InformacoesDeEstudante } from '@/app/elementos/modulos/InformacoesDeEstudante';
import { fetchTicketsSemJustificativa } from '@/app/actions/fetchTicketsSemJustificativa';
import { FetchHelper } from '@/app/lib/actions/FetchHelper';
import { cookies } from 'next/headers';
import { IRefeicao } from '@/app/elementos/interfaces/IRefeicao';

export default async function Home() {

  const ticketsSemJustificativa = await FetchHelper.get<IRefeicao>({
    url: '/student/schedulings/not-used-without-justification',
    cookies: cookies(),
  })

  return (
    <>
      <InformacoesDeEstudante />
      {
        ticketsSemJustificativa.sucesso ?
          <Aviso titulo='Aviso' texto='Você possui um ou mais tickets pendentes de justificativa. Por favor, acesse o histórico de refeições para regularizar sua situação.' />
          : null
      }
    </>
  );
}