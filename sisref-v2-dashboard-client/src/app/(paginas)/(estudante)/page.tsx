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
import { Refeicao } from '@elementos/componentes/Refeicao';
import { IRefeicao } from '@elementos/interfaces/IRefeicao';
import Aviso from '@elementos/basicos/Aviso';
import { SecaoApenasTexto } from '@elementos/componentes/SecaoApenasTexto';
import { Navbar } from '@elementos/modulos/Navbar';
import { Footer } from '@elementos/componentes/Footer';
import { RefeicaoAutorizada } from '@elementos/componentes/RefeicaoAutorizada';
import { InformacoesPessoais } from '@elementos/modulos/InformacoesPessoais';
import { IInformacoesPessoais } from '@elementos/interfaces/IInformacoesPessoais';

const mockRefeicoes: IRefeicao[] = [
  {
    turno: 1,
    refeicao: {
      description: "Lanche da manhã",
      qtdTimeReservationEnd: 1,
      qtdTimeReservationStart: 9,
      timeEnd: "12:00",
      timeStart: "11:00"
    },
  },
  {
    turno: 2,
    refeicao: {
      description: "Almoço",
      qtdTimeReservationStart: 2,
      qtdTimeReservationEnd: 1,
      timeEnd: "20:00",
      timeStart: "18:00"
    },
    cardapio: {
      agendado: false,
      date: "2024-04-14",
      description: "Arroz parbolizado; Feijão preto; Lombo Suíno frito; Salada de alface e tomate; Suco de laranja; Banana prata; Pão francês;",
      permission: true,
      id: 2438,
      campus_id: 2
    }
  },
  {
    turno: 3,
    refeicao: {
      description: "Lanche da tarde",
      qtdTimeReservationEnd: 1,
      qtdTimeReservationStart: 10,
      timeStart: "20:00",
      timeEnd: "21:00",
    },
    cardapio: {
      agendado: false,
      date: "2024-04-14",
      description: "Suco de laranja + Sanduíche",
      permission: true,
      id: 2439,
      campus_id: 3
    }
  },
  {
    turno: 4,
    refeicao: {
      description: "Jantar",
      qtdTimeReservationEnd: 4,
      qtdTimeReservationStart: 19,
      timeEnd: "21:00",
      timeStart: "20:00"
    },
    cardapio: {
      agendado: false,
      date: "2024-04-14",
      description: "Sopa de legumes",
      permission: true,
      id: 2440,
      campus_id: 4,
      canceled_by_student: false
    }
  }
];

const mockInformacoesEstudante: IInformacoesPessoais = {
  name: 'João da Silva',
  mat: '1234',
  course: {
    description: 'Ciência da Computação'
  },
  campus: {
    description: 'Juazeiro do Norte'
  },
  shift_id: 1,
  id: '5678',
  dateValid: '2023-12-31',
  active: 1
}

export default function Home() {
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
      <main className='grid gap-y-8 px-6 my-8'>
        <InformacoesPessoais {...mockInformacoesEstudante} />
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

          <RefeicaoAutorizada
            variante="almoco"
            horarios={{ qtdTimeReservationEnd: 11, qtdTimeReservationStart: 20, timeEnd: "13:00", timeStart: "11:20" }}
            dias={['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira']}
          />

          <Aviso titulo='Texto de aviso' texto="Devido à queda da internet no campus, todas as reservas de alimentação, exceto a do lanche da noite, serão feitas de maneira presencial na recepção." />

          {
            ([1, 2, 3, 4] as const).map((turno) => (
              <Refeicao key={turno} turno={turno} refeicao={
                mockRefeicoes.find((refeicao) => refeicao.turno === turno)?.refeicao
              } cardapio={
                mockRefeicoes.find((refeicao) => refeicao.turno === turno)?.cardapio
              } />
            ))
          }

          <SecaoApenasTexto titulo="Texto de seção apenas com texto" texto="Texto de conteúdo de seção apenas com texto" />
        </Secao>



      </main>
      <Footer />
    </>
  );
}