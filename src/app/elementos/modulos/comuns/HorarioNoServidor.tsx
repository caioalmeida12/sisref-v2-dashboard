"use client";

import { buscarHorarioNoServidor } from "@/app/actions/comuns";
import { useQuery } from "@tanstack/react-query";

/**
 * Retorna um span contendo o horário no servidor
 * @param intervalo_de_atualizacao quantos milissegundos devem passar entre cada atualização: 30 * 1000 -> 30s (intervalo padrão)
 */
export function HorarioNoServidor({
  intervalo_de_atualizacao,
}: {
  intervalo_de_atualizacao?: number;
}) {
  const { data: horario } = useQuery({
    queryKey: ["horarioNoServidor"],
    queryFn: async () => {
      const resposta = await buscarHorarioNoServidor();

      return resposta.sucesso ? resposta.resposta[0] : resposta.mensagem;
    },
    refetchInterval: intervalo_de_atualizacao ?? 30 * 1000,
  });

  return <span>{horario ?? "não encontrado"}</span>;
}
