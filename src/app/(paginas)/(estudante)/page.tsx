import React from 'react';
import { FetchHelper } from '@/app/lib/actions/FetchHelper';
import { cookies } from 'next/headers';
import { IRefeicao } from '@/app/elementos/interfaces/IRefeicao';
import { Aviso } from '@/app/elementos/modulos/estudante/Aviso';
import { InformacoesDeEstudante } from '@/app/elementos/modulos/estudante/InformacoesDeEstudante';

export default async function Home() {

  const ticketsSemJustificativa = await FetchHelper.get<IRefeicao>({
    rota: '/student/schedulings/not-used-without-justification',
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