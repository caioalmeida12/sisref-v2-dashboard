import React from 'react';
import { Secao } from './elementos/basicos/Secao';
import { CabeçalhoDeSecao } from './elementos/basicos/CabecalhoDeSecao';
import { CabecalhoPrincipal } from './elementos/basicos/CabecalhoPrincipal';
import { CampoDeSecao } from './elementos/componentes/CampoDeSecao';
import { Botao } from './elementos/basicos/Botao';
import { Slider } from './elementos/componentes/Slider';
import { StatusDaRefeicao } from './elementos/basicos/StatusDaRefeicao';
import { NomeDaRefeicao } from './elementos/basicos/NomeDaRefeicao';
import { RestricaoAlimentar } from './elementos/basicos/RestricaoAlimentar';
import { HorarioDaRefeicao } from './elementos/basicos/HorarioDaRefeicao';
import { Refeicao } from './elementos/componentes/Refeicao';

export default function Home() {
  return (
    <main>
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

        <Refeicao turno={1} />
        <Refeicao
          turno={2}
          cardapio={{
            "agendado": true,
            "campus_id": 1,
            "date": "2024-04-12",
            "description": "Arroz + Feijão + Bife + Salada",
            "id": 2437,
            "permission": true

          }}
          refeicao={{
            description: "Vitamina de maçã + Biscoito/Bolacha",
            qtdTimeReservationEnd: 0,
            qtdTimeReservationStart: 0,
            timeEnd: "12:00",
            timeStart: "11:00"
          }}
        />
        <Refeicao
          turno={4}
          cardapio={{
            "agendado": false,
            "campus_id": 1,
            "date": "2024-04-12",
            "description": "Vitamina de maçã + Biscoito/Bolacha",
            "id": 2437,
            "permission": true
          }}
          refeicao={{
            description: "Vitamina de maçã + Biscoito/Bolacha",
            qtdTimeReservationEnd: 0,
            qtdTimeReservationStart: 0,
            timeEnd: "12:00",
            timeStart: "11:00"
          }}
        />
      </Secao>
    </main>
  );
}