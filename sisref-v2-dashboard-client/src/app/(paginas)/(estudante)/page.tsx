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

        <Secao>
          <CabeçalhoDeSecao titulo="Texto de cabeçalho de seção" />
          <CabecalhoPrincipal titulo="Texto de cabeçalho principal" />
          <h1>Olá, mundo!</h1>
          <CampoDeSecao titulo="Texto de campo de seção" complemento="Texto de complemento de campo de seção" variante="horizontal" />
          <CampoDeSecao titulo="Texto de campo de seção" complemento="Texto de complemento de campo de seção" variante="vertical" />
          <CampoDeSecao titulo="Texto de campo de seção" complemento="Texto de complemento de campo de seção" variante="horizontal-com-badge" corDaBadge="bg-verde-400" />

          <Botao texto="Adicionar" variante="adicionar" />
          <Botao texto="Editar" variante="editar" />
          <Botao texto="Ocultar" variante="ocultar" />
          <Botao texto="Remover" variante="remover" />

          <Slider texto='1/10' />

          <StatusDaRefeicao texto='Utilizado' cor='verde-300' icone='circulo-check' />
          <StatusDaRefeicao texto='Reservado' cor='verde-300' icone='circulo-check' />
          <StatusDaRefeicao texto='Disponível' cor='cinza-600' icone='circulo-check' />
          <StatusDaRefeicao texto='Justificado' cor='azul-400' icone='circulo-check' />
          <StatusDaRefeicao texto='Encerrado' cor='cinza-600' icone='circulo-x' />
          <StatusDaRefeicao texto='Cancelado' cor='vermelho-400' icone='tag-x' />
          <StatusDaRefeicao texto='Não utilizado' cor='amarelo-200' icone='circulo-check' />
          <StatusDaRefeicao texto='Bloqueado' cor='amarelo-200' icone='cadeado' />

          <NomeDaRefeicao variante='manha' />
          <NomeDaRefeicao variante='almoco' />
          <NomeDaRefeicao variante='tarde' />
          <NomeDaRefeicao variante='noite' />

          <RestricaoAlimentar texto='Glúten' />

          <HorarioDaRefeicao variante='data' data='12/04/2024' />
          <HorarioDaRefeicao variante='horario' horarios={{ qtdTimeReservationEnd: 0, qtdTimeReservationStart: 0, timeEnd: '12:00', timeStart: '11:00' }} />
          <HorarioDaRefeicao variante='horario-e-data' horarios={{ qtdTimeReservationEnd: 0, qtdTimeReservationStart: 0, timeEnd: '12:00', timeStart: '11:00' }} data='12/04/2024' />

          <Aviso titulo='Texto de aviso' texto="Devido à queda da internet no campus, todas as reservas de alimentação, exceto a do lanche da noite, serão feitas de maneira presencial na recepção." />


          <SecaoApenasTexto titulo="Texto de seção apenas com texto" texto="Texto de conteúdo de seção apenas com texto" />
        </Secao>



      </main>
      <Footer />
    </>
  );
}