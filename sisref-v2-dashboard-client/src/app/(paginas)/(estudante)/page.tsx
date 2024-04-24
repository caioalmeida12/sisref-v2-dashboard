import React from 'react';
import { Navbar } from '@elementos/modulos/Navbar';
import { Footer } from '@elementos/componentes/Footer';
import { InformacoesDeEstudante } from '@/app/elementos/modulos/InformacoesDeEstudante';
import { RefeicoesPorDia } from '@/app/elementos/modulos/RefeicoesPorDia';
import { RestricoesAlimentares } from '@/app/elementos/modulos/RestricoesAlimentares/RestricoesAlimentares';
import { RefeicoesAutorizadas } from '@/app/elementos/modulos/RefeicoesAutorizadas';
import { Aviso } from '@/app/elementos/modulos/Aviso';

export default async function Home() {
  return (
    <>
      <Navbar navItems={[
        {
          titulo: 'Estatísticas', itens: [{
            titulo: 'Hoje', rota: '/hoje',
          }, {
            titulo: 'Semana', rota: '/semana',
          }, {
            titulo: 'Mês', rota: '/mes',
          }], isDropdown: true
        },
        {
          titulo: 'Cardápio', rota: '/cardapio',
        },
        {
          titulo: 'Refeições', rota: '/refeicoes',
        },
        {
          titulo: 'Relatórios', rota: '/relatorios',
        },
        {
          titulo: 'Avisos', rota: '/avisos',
        },
      ]} />
      <main className='w-full grid gap-y-8 px-6 my-8'>
        <InformacoesDeEstudante />
        <Aviso titulo='Aviso' texto='Você possui uma refeição pendente. Por favor, vá até a cantina para retirá-la.' />
        <RefeicoesPorDia />
        <RestricoesAlimentares />
        <RefeicoesAutorizadas />
      </main>
      <Footer />
    </>
  );
}