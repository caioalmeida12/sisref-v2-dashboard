import React from 'react';
import { Secao } from '@elementos/basicos/Secao';
import { CabeçalhoDeSecao } from '@elementos/basicos/CabecalhoDeSecao';
import { CabecalhoPrincipal } from '@elementos/basicos/CabecalhoPrincipal';
import { CampoDeSecao } from '@elementos/componentes/CampoDeSecao';
import { Botao } from '@elementos/basicos/Botao';
import { Slider } from '@elementos/componentes/Slider';
import { StatusDaRefeicao } from '@elementos/basicos/StatusDaRefeicao';
import { NomeDaRefeicao } from '@elementos/basicos/NomeDaRefeicao';
import { RestricaoAlimentar } from '@elementos/basicos/RestricaoAlimentar';
import { HorarioDaRefeicao } from '@elementos/basicos/HorarioDaRefeicao';
import { Aviso } from '@elementos/basicos/Aviso';
import { SecaoApenasTexto } from '@elementos/componentes/SecaoApenasTexto';
import { Navbar } from '@elementos/modulos/Navbar';
import { Footer } from '@elementos/componentes/Footer';
import { InformacoesDeEstudante } from '@/app/elementos/modulos/InformacoesDeEstudante';
import { RefeicoesPorDia } from '@/app/elementos/modulos/RefeicoesPorDia';
import { RestricoesAlimentares } from '@/app/elementos/modulos/RestricoesAlimentares/RestricoesAlimentares';
import { RefeicoesAutorizadas } from '@/app/elementos/modulos/RefeicoesAutorizadas';

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
        <RefeicoesPorDia />
        <RestricoesAlimentares />
        <RefeicoesAutorizadas />
      </main>
      <Footer />
    </>
  );
}