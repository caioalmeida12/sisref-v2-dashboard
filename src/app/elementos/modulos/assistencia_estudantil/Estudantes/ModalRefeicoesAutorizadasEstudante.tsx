"use client";

import { buscarRefeicoesAutorizadasPorEstudante } from "@/app/actions/assistencia_estudantil";
import { Botao } from "@/app/elementos/basicos/Botao";
import { CustomTooltipWrapper } from "@/app/elementos/basicos/CustomTooltipWrapper";
import Icone from "@/app/elementos/basicos/Icone";
import { TBuscarRefeicoesAutorizadas } from "@/app/interfaces/TBuscarRefeicoesAutorizadas";
import { TEstudanteComCursoTurnoEUsuario } from "@/app/interfaces/TEstudante";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useEffect, useState } from "react";

interface ModalProps {
  estudante: TEstudanteComCursoTurnoEUsuario;
}

const diasDaSemana = [
  { key: "monday", label: "Segunda-feira" },
  { key: "tuesday", label: "Terça-feira" },
  { key: "wednesday", label: "Quarta-feira" },
  { key: "thursday", label: "Quinta-feira" },
  { key: "friday", label: "Sexta-feira" },
  { key: "saturday", label: "Sábado" },
  { key: "sunday", label: "Domingo" },
];

const refeicoes = [
  { id: 1, nome: "Lanche da Manhã" },
  { id: 2, nome: "Almoço" },
  { id: 3, nome: "Lanche da Tarde" },
  { id: 4, nome: "Lanche da Noite" },
];

export const ModalRefeicoesAutorizadasEstudante: React.FC<ModalProps> = ({
  estudante,
}) => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: refeicoesAutorizadas,
    isFetching: isLoadingRefeicoesAutorizadas,
    refetch,
  } = useQuery<TBuscarRefeicoesAutorizadas[]>({
    queryKey: ["refeicoesAutorizadas", estudante.id],
    queryFn: async () => {
      const resposta = await buscarRefeicoesAutorizadasPorEstudante(
        estudante.id,
      );

      return resposta.sucesso ? resposta.resposta : [];
    },
    initialData: [],
    enabled: isModalOpen,
  });

  useEffect(() => {
    if (isModalOpen) refetch();
  }, [isModalOpen]);

  const columns: ColumnDef<{ [key: string]: string | number }>[] =
    React.useMemo(
      () => [
        {
          header: "Refeição",
          accessorKey: "nome",
        },
        ...diasDaSemana.map((dia) => ({
          header: dia.label,
          accessorKey: dia.key,
        })),
      ],
      [],
    );

  const data = React.useMemo(
    () =>
      refeicoes.map((refeicao) => {
        const row: { [key: string]: string | number } = { nome: refeicao.nome };
        diasDaSemana.forEach((dia) => {
          const autorizada = refeicoesAutorizadas.some(
            (ref) =>
              ref.meal_id === refeicao.id &&
              ref[dia.key as keyof TBuscarRefeicoesAutorizadas] !== null &&
              typeof ref[dia.key as keyof TBuscarRefeicoesAutorizadas] ===
                "number" &&
              (ref[dia.key as keyof TBuscarRefeicoesAutorizadas] as number) > 0,
          );
          row[dia.key] = autorizada ? "Autorizada" : "Não Autorizada";
        });
        return row;
      }),
    [refeicoesAutorizadas],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Dialog.Trigger>
        <CustomTooltipWrapper
          elementoContent={"Ver refeições autorizadas"}
          elementoTrigger={
            <div className="relative h-5 w-5 cursor-pointer">
              <Icone.RefeicoesAutorizadas className="absolute inset-0 block h-full w-full" />
            </div>
          }
        />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-preto-400/25 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-[50%] top-[50%] flex max-h-[85vh] w-[90vw] max-w-[800px] translate-x-[-50%] translate-y-[-50%] flex-col gap-y-2 rounded bg-branco-400 p-6 outline outline-1 outline-cinza-600 focus:outline-none data-[state=open]:animate-contentShow">
          <Dialog.Title className="m-0 text-lg font-medium">
            Refeições autorizadas para {estudante.name}
          </Dialog.Title>
          <div className="max-w-full overflow-x-auto">
            <table className="w-full max-w-full text-center">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="px-4 py-2">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end gap-x-2">
            <Dialog.Close asChild>
              <Botao variante="editar" texto="Fechar" />
            </Dialog.Close>
          </div>
          <Dialog.Close>
            <div
              className="absolute right-2 top-2 inline-flex appearance-none items-center justify-center rounded-full p-[0.25em] hover:bg-cinza-400 focus:shadow-[0_0_0_2px] focus:shadow-cinza-400 focus:outline-none"
              aria-label="Fechar"
            >
              <Cross2Icon />
            </div>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
