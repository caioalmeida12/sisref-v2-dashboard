"use client";

import { IRequisicaoPaginadaQueryStates } from "@/app/interfaces/IRespostaPaginadaQueryStates";
import {
  ColumnDef,
  ColumnFiltersState,
  ColumnResizeDirection,
  ColumnResizeMode,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowData,
  useReactTable,
} from "@tanstack/react-table";
import { SetValues, Values } from "nuqs";
import React, { useState } from "react";
import Skeleton from "react-loading-skeleton";
import { PaginacaoNoCliente } from "./PaginacaoNoCliente";
import { PaginacaoNoServidor } from "./PaginacaoNoServidor";

/* eslint-disable @typescript-eslint/no-unused-vars */
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "text" | "range" | "select";
  }
}
/* eslint-enable @typescript-eslint/no-unused-vars */

export interface ITabelaDeCrudProps<TipoDeDado> {
  colunas: ColumnDef<TipoDeDado, any>[];
  dados: TipoDeDado[];
  estaCarregando?: boolean;
  ordenacaoPadrao?: { id: string; desc: boolean }[];
  filtros?: ColumnFiltersState;
  paginacaoNoServidor?: {
    paginacao: Values<IRequisicaoPaginadaQueryStates>;
    setPaginacao: SetValues<IRequisicaoPaginadaQueryStates>;
  };
}

export function TabelaDeCrud<TipoDeDado>({
  colunas,
  dados,
  estaCarregando,
  ordenacaoPadrao,
  // filtros,
  paginacaoNoServidor,
}: ITabelaDeCrudProps<TipoDeDado>) {
  // const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
  //   filtros ?? [],
  // );
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>(
    ordenacaoPadrao ?? [],
  );
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
  });

  // Garante que os filtros sejam atualizados quando a propriedade `filtros` for alterada
  // Sem isso, os filtros só são atualizados quando a página é recarregada
  // useEffect(() => {
  //   setColumnFilters(filtros ?? []);
  // }, [filtros]);

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [columnResizeMode, _setColumnResizeMode] =
    useState<ColumnResizeMode>("onChange");

  const [columnResizeDirection, _setColumnResizeDirection] =
    useState<ColumnResizeDirection>("ltr");
  /* eslint-enable @typescript-eslint/no-unused-vars */

  const table = useReactTable({
    data: dados,
    columns: colunas,
    state: {
      // columnFilters,
      sorting,
      pagination,
    },
    columnResizeMode,
    columnResizeDirection,
    getCoreRowModel: getCoreRowModel(),
    // onColumnFiltersChange: setColumnFilters,
    // getFilteredRowModel: getFilteredRowModel(), //client-side filtering
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(),
    enableColumnResizing: true,
    // getFacetedRowModel: getFacetedRowModel(), // client-side faceting
    // getFacetedUniqueValues: getFacetedUniqueValues(), // generate unique values for select filter/autocomplete
    // getFacetedMinMaxValues: getFacetedMinMaxValues(), // generate min/max values for range filter
    debugTable: false,
    debugHeaders: true,
    debugColumns: false,
    debugAll: false,
    manualPagination: typeof paginacaoNoServidor !== "undefined",
    rowCount: paginacaoNoServidor?.paginacao.per_page,
    pageCount: paginacaoNoServidor?.paginacao.page,
  });

  return (
    <div className="max-w-full overflow-x-auto">
      <table className="w-full max-w-full text-center">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <React.Fragment key={headerGroup.id}>
              <tr>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="group relative h-1 cursor-pointer px-[0.125em] first-of-type:pl-0 last-of-type:pr-0"
                    onClick={() => {
                      const isDesc = sorting.find(
                        (sort) => sort.id === header.id,
                      )?.desc;
                      setSorting([{ id: header.id, desc: !isDesc }]);
                    }}
                  >
                    <div
                      className={
                        header.column.getCanSort()
                          ? "bg-preto-400 text-branco-400 flex h-full cursor-pointer flex-col justify-center rounded select-none"
                          : "bg-preto-400 text-branco-400 flex h-full flex-col justify-center rounded"
                      }
                      onClick={header.column.getToggleSortingHandler()}
                      title={
                        header.column.getCanSort()
                          ? header.column.getNextSortingOrder() === "asc"
                            ? "Crescente"
                            : header.column.getNextSortingOrder() === "desc"
                              ? "Decrescente"
                              : "Limpar ordenação"
                          : undefined
                      }
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {/* {{
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted() as string] ?? null} */}
                    </div>
                    {header.column.getCanResize() && (
                      <div
                        onDoubleClick={() => header.column.resetSize()}
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={`bg-cinza-600/75 absolute inset-y-0 right-0 w-1 cursor-col-resize touch-none rounded opacity-0 select-none group-hover:opacity-100 ${table.options.columnResizeDirection} ${header.column.getIsResizing() ? "isResizing" : ""}`}
                        style={{
                          transform:
                            columnResizeMode === "onEnd" &&
                            header.column.getIsResizing()
                              ? `translateX(${(table.options.columnResizeDirection === "rtl" ? -1 : 1) * (table.getState().columnSizingInfo.deltaOffset ?? 0)}px)`
                              : "",
                        }}
                      />
                    )}
                  </th>
                ))}
              </tr>
              <tr>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="group relative h-1 cursor-pointer px-[0.125em] first-of-type:pl-0 last-of-type:pr-0"
                  >
                    {/* {header.column.getCanFilter() ? (
                      <Filtro column={header.column} />
                    ) : null} */}
                  </th>
                ))}
              </tr>
            </React.Fragment>
          ))}
        </thead>
        <tbody className="block py-[.125em]"></tbody>
        <tbody>
          {estaCarregando ? (
            Array.from({ length: 10 }).map((_, index) => (
              <tr key={index}>
                {colunas.map((_coluna, index) => (
                  <td
                    key={index}
                    className="px-[.125em] first-of-type:pl-0 last-of-type:pr-0"
                  >
                    <Skeleton className="h-5" />
                  </td>
                ))}
              </tr>
            ))
          ) : dados.length === 0 || table.getRowCount() == 0 ? (
            <tr className="hover:bg-amarelo-200/75!">
              <td
                colSpan={colunas.length}
                className="bg-cinza-400 rounded text-center"
              >
                Nenhum dado encontrado
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-amarelo-200/75! nth-of-type-[odd]:bg-cinza-400"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    style={{
                      width: cell.column.getSize(),
                    }}
                    className="px-2 first-of-type:rounded-tl first-of-type:rounded-bl last-of-type:rounded-tr last-of-type:rounded-br"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="h-2" />
      {paginacaoNoServidor
        ? PaginacaoNoServidor({
            paginacaoNoServidor,
            desligarNavegacao: Boolean(estaCarregando),
          })
        : PaginacaoNoCliente(table as any)}
    </div>
  );
}
