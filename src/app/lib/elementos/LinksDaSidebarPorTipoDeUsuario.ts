import { ISidebarProps } from "@/app/interfaces/ISidebar";

export const linksDaSidebarPorTipoDeUsuario: Record<
  ISidebarProps["tipo_de_usuario"],
  ISidebarProps["itens"]
> = {
  STUDENT: [
    {
      titulo: "Refeições",
      rota: "?pagina=refeicoesPorDia",
      icone: "Refeicao",
    },
    {
      titulo: "Histórico de refeições",
      rota: "?pagina=historicoDeRefeicoes",
      icone: "Ampulheta",
    },
    {
      titulo: "Refeições autorizadas",
      rota: "?pagina=refeicoesAutorizadas",
      icone: "GarfoEFaca",
    },
  ],
  ASSIS_ESTU: [
    {
      titulo: "Agendamentos",
      rota: "/assistencia_estudantil",
      icone: "Calendario",
    },
    {
      titulo: "Estudantes",
      rota: "/assistencia_estudantil/estudantes",
      icone: "Usuario",
    },
    {
      titulo: "Cardápios",
      rota: "/assistencia_estudantil/cardapios",
      icone: "GarfoEFaca",
    },
    {
      titulo: "Repúblicas",
      rota: "/assistencia_estudantil/republicas",
      icone: "Casa",
    },
    {
      titulo: "Cursos",
      rota: "/assistencia_estudantil/cursos",
      icone: "EstudanteComChapeu",
    },
    {
      titulo: "Turnos",
      rota: "/assistencia_estudantil/turnos",
      icone: "Ampulheta",
    },
    {
      titulo: "Relatório de refeições",
      rota: "/assistencia_estudantil/relatorioDeRefeicoes",
      icone: "GraficoDeBarras",
    },
    {
      titulo: "Relatório de desperdício",
      rota: "/assistencia_estudantil/relatorioDeDesperdicio",
      icone: "Lixeira",
    },
  ],
  NUTRI: [
    {
      titulo: "Agendamentos",
      rota: "/nutricionista",
      icone: "Calendario",
    },
    {
      titulo: "Cardápios",
      rota: "/nutricionista/cardapios",
      icone: "GarfoEFaca",
    },
    {
      titulo: "Refeições",
      rota: "/nutricionista/refeicoes",
      icone: "GarfoEFaca",
    },
    {
      titulo: "Relatório de refeições",
      rota: "/nutricionista/relatorio-de-refeicoes",
      icone: "GraficoDeBarras",
    },
    {
      titulo: "Relatório de desperdício",
      rota: "/nutricionista/relatorio-de-desperdicio",
      icone: "Lixeira",
    },
  ],
  RECEPCAO: [
    {
      titulo: "Confirmar refeições",
      rota: "/recepcao",
      icone: "GarfoEFaca",
    },
    {
      titulo: "Desperdício",
      rota: "/recepcao/relatorio-de-desperdicio",
      icone: "Lixeira",
    },
    {
      titulo: "Relatório de refeições",
      rota: "/recepcao/relatorio-de-refeicoes",
      icone: "GraficoDeBarras",
    },
  ],
  ADMIN: [
    {
      titulo: "Usuários",
      rota: "?pagina=usuarios",
      icone: "Usuario",
    },
    {
      titulo: "Campi",
      rota: "?pagina=campi",
      icone: "Casa",
    },
  ],
};
