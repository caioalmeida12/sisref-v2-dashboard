import { ISidebarProps } from "@/app/elementos/interfaces/ISidebar";

export const linksDaSidebarPorTipoDeUsuario: Record<ISidebarProps["tipo_de_usuario"], ISidebarProps["itens"]> = {
    STUDENT: [
        {
            titulo: 'Refeições', rota: '?pagina=refeicoesPorDia', icone: 'Refeicao',
        },
        {
            titulo: 'Histórico de refeições', rota: '?pagina=historicoDeRefeicoes', icone: 'Ampulheta',
        },
        {
            titulo: 'Refeições autorizadas', rota: '?pagina=refeicoesAutorizadas', icone: 'GarfoEFaca'
        }
    ],
    ASSIS_ESTU: [
        {
            titulo: 'Agendamentos', rota: '?pagina=agendamentos', icone: 'Calendario'
        },
        {
            titulo: 'Estudantes', rota: '?pagina=estudantes', icone: 'Usuario'
        },
        {
            titulo: 'Cardápios', rota: '?pagina=cardapios', icone: 'GarfoEFaca'
        },
        {
            titulo: 'Repúblicas', rota: '?pagina=republicas', icone: 'Casa'
        },
        {
            titulo: 'Cursos', rota: '?pagina=cursos', icone: 'EstudanteComChapeu'
        },
        {
            titulo: 'Turnos', rota: '?pagina=turnos', icone: 'Ampulheta'
        },
        {
            titulo: 'Relatório de refeições', rota: '?pagina=relatorioDeRefeicoes', icone: 'GraficoDeBarras'
        },
        {
            titulo: 'Relatório de desperdício', rota: '?pagina=relatorioDeDesperdicio', icone: 'Lixeira'
        }
    ],
    NUTRI: [
        {
            titulo: 'Agendamentos', rota: '/nutricionista', icone: 'Calendario'
        },
        {
            titulo: 'Cardápios', rota: '/nutricionista/cardapios', icone: 'GarfoEFaca'
        },
        {
            titulo: 'Refeições', rota: '/nutricionista/refeicoes', icone: 'GarfoEFaca'
        },
        {
            titulo: 'Relatório de refeições', rota: '/nutricionista/relatorio-de-refeicoes', icone: 'GraficoDeBarras'
        },
        {
            titulo: 'Relatório de desperdício', rota: '/nutricionista/relatorio-de-desperdicio', icone: 'Lixeira'
        }
    ],
    RECEPCAO: [
        {
            titulo: 'Confirmar refeições', rota: '?pagina=confirmarRefeicoes', icone: 'GarfoEFaca'
        },
        {
            titulo: 'Desperdício', rota: '?pagina=desperdicio', icone: 'Lixeira'
        },
        {
            titulo: 'Relatório de refeições', rota: '?pagina=relatorioDeRefeicoes', icone: 'GraficoDeBarras'
        }
    ],
    ADMIN: [
        {
            titulo: 'Usuários', rota: '?pagina=usuarios', icone: 'Usuario'
        },
        {
            titulo: 'Campi', rota: '?pagina=campi', icone: 'Casa'
        }
    ]
}