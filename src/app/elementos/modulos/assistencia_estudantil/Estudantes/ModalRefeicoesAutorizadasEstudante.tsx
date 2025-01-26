"use client";

import { buscarRefeicoesAutorizadasPorEstudante } from "@/app/actions/assistencia_estudantil";
import { Botao } from "@/app/elementos/basicos/Botao";
import { CustomTooltipWrapper } from "@/app/elementos/basicos/CustomTooltipWrapper";
import Icone from "@/app/elementos/basicos/Icone";
import { TBuscarRefeicoesAutorizadas } from "@/app/interfaces/TBuscarRefeicoesAutorizadas";
import { TEstudanteComCursoTurnoEUsuario } from "@/app/interfaces/TEstudante";
import { handleStudentMealData } from "@/app/lib/elementos/HandleSudentMealData";
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
import { useForm, Controller } from "react-hook-form";

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
  const { control, watch, handleSubmit, setValue } = useForm();

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

  useEffect(() => {
    if (refeicoesAutorizadas) {
      refeicoesAutorizadas.forEach((refeicao) => {
        diasDaSemana.forEach((dia) => {
          setValue(
            `${refeicao.meal_id}-${dia.key}`,
            refeicao[dia.key as keyof TBuscarRefeicoesAutorizadas] === 1,
          );
        });
        setValue(`comentario-${refeicao.meal_id}`, refeicao.comentario || "");
      });
    }
  }, [refeicoesAutorizadas, setValue]);

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

  const onSubmit = (data: any) => {
    const formattedData = handleStudentMealData(data);
    // Enviar formattedData para a API
    console.log(formattedData);
  };

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
        <Dialog.Content className="fixed left-[50%] top-[50%] flex max-h-[85vh] w-[95vw] max-w-[1200px] translate-x-[-50%] translate-y-[-50%] flex-col gap-y-2 rounded bg-branco-400 p-6 outline outline-1 outline-cinza-600 focus:outline-none data-[state=open]:animate-contentShow">
          <Dialog.Title className="m-0 text-lg font-medium">
            Refeições autorizadas para {estudante.name}
          </Dialog.Title>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="max-w-full overflow-x-auto">
              <table className="w-full max-w-full border border-cinza-600 text-center">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="border border-cinza-600 px-4 py-2"
                        >
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
                        <td
                          key={cell.id}
                          className={`border border-cinza-600 px-4 py-2 has-[input[value="true"]]:bg-verde-300 has-[input]:bg-vermelho-200`}
                        >
                          {cell.column.id === "nome" ? (
                            flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )
                          ) : (
                            <Controller
                              name={`${row.id}-${cell.column.id}`}
                              control={control}
                              defaultValue={cell.getValue() === "Autorizada"}
                              render={({ field }) => (
                                <input
                                  type="checkbox"
                                  {...field}
                                  defaultChecked={field.value}
                                  className="peer"
                                />
                              )}
                            />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col gap-y-2">
              <label htmlFor="comentario">Comentário:</label>
              <Controller
                name="comentario"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <textarea
                    id="comentario"
                    {...field}
                    className="border border-cinza-600 p-2"
                  />
                )}
              />
            </div>
            <div className="mt-4 flex justify-end gap-x-2">
              <Dialog.Close asChild>
                <Botao variante="editar" texto="Fechar" />
              </Dialog.Close>
              <Botao variante="editar" texto="Salvar" type="submit" />
            </div>
          </form>
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
