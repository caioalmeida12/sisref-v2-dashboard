"use client";

import React, { useEffect, useState } from "react";
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  ColumnResizeDirection,
  ColumnResizeMode,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  RowData,
} from "@tanstack/react-table";
import Skeleton from "react-loading-skeleton";
import { IRespostaPaginada } from "@/app/interfaces/IRespostaPaginada";
import Link from "next/link";
import { createSerializer, parseAsInteger, useQueryState } from "nuqs";
import { useSearchParams } from "next/navigation";

/* eslint-disable @typescript-eslint/no-unused-vars */
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "text" | "range" | "select";
  }
}
/* eslint-enable @typescript-eslint/no-unused-vars */

interface ITabelaDeCrudProps<TipoDeDado> {
  colunas: ColumnDef<TipoDeDado, any>[];
  dados: TipoDeDado[];
  estaCarregando?: boolean;
  ordenacaoPadrao?: { id: string; desc: boolean }[];
  filtros?: ColumnFiltersState;
  paginacaoNoServidor?: {
    per_page: number;
    page: number;
    respostaPaginada: IRespostaPaginada<TipoDeDado>;
  };
}

export function TabelaDeCrud<TipoDeDado>({
  colunas,
  dados,
  estaCarregando,
  ordenacaoPadrao,
  filtros,
  paginacaoNoServidor,
}: ITabelaDeCrudProps<TipoDeDado>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    filtros ?? [],
  );
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>(
    ordenacaoPadrao ?? [],
  );
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
  });

  // Garante que os filtros sejam atualizados quando a propriedade `filtros` for alterada
  // Sem isso, os filtros só são atualizados quando a página é recarregada
  useEffect(() => {
    setColumnFilters(filtros ?? []);
  }, [filtros]);

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
      columnFilters,
      sorting,
      pagination,
    },
    columnResizeMode,
    columnResizeDirection,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(), //client-side filtering
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(),
    enableColumnResizing: true,
    getFacetedRowModel: getFacetedRowModel(), // client-side faceting
    getFacetedUniqueValues: getFacetedUniqueValues(), // generate unique values for select filter/autocomplete
    getFacetedMinMaxValues: getFacetedMinMaxValues(), // generate min/max values for range filter
    debugTable: false,
    debugHeaders: true,
    debugColumns: false,
    debugAll: false,
    manualPagination: typeof paginacaoNoServidor !== "undefined",
    rowCount: paginacaoNoServidor?.per_page,
    pageCount: paginacaoNoServidor?.page,
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
                    className="group relative h-1 cursor-pointer px-[0.125em] [&:first-of-type]:pl-0 [&:last-of-type]:pr-0"
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
                          ? "flex h-full cursor-pointer select-none flex-col justify-center rounded bg-preto-400 text-branco-400"
                          : "flex h-full flex-col justify-center rounded bg-preto-400 text-branco-400"
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
                      {{
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                    {header.column.getCanResize() && (
                      <div
                        onDoubleClick={() => header.column.resetSize()}
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={`absolute inset-y-0 right-0 w-1 cursor-col-resize touch-none select-none rounded bg-cinza-600/75 opacity-0 group-hover:opacity-100 ${table.options.columnResizeDirection} ${header.column.getIsResizing() ? "isResizing" : ""}`}
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
                    className="group relative h-1 cursor-pointer px-[0.125em] [&:first-of-type]:pl-0 [&:last-of-type]:pr-0"
                  >
                    {header.column.getCanFilter() ? (
                      <Filter column={header.column} />
                    ) : null}
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
                    className="px-[.125em] [&:first-of-type]:pl-0 [&:last-of-type]:pr-0"
                  >
                    <Skeleton className="h-5" />
                  </td>
                ))}
              </tr>
            ))
          ) : dados.length === 0 || table.getRowCount() == 0 ? (
            <tr className="hover:!bg-amarelo-200/75">
              <td
                colSpan={colunas.length}
                className="rounded bg-cinza-400 text-center"
              >
                Nenhum dado encontrado
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:!bg-amarelo-200/75 [&:nth-of-type(odd)]:bg-cinza-400"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    style={{
                      width: cell.column.getSize(),
                    }}
                    className="px-2 [&:first-of-type]:rounded-bl [&:first-of-type]:rounded-tl [&:last-of-type]:rounded-br [&:last-of-type]:rounded-tr"
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
        ? ServerSidePagination(paginacaoNoServidor)
        : ClientSidePagination(table as any)}
    </div>
  );
}

function ServerSidePagination(
  paginacaoNoServidor: NonNullable<
    ITabelaDeCrudProps<any>["paginacaoNoServidor"]
  >,
) {
  const serialize = createSerializer({
    page: parseAsInteger,
    per_page: parseAsInteger,
  });

  const first_page_number =
    paginacaoNoServidor.respostaPaginada.first_page_url.split("page=")[1] ?? "";

  const last_page_number = paginacaoNoServidor.respostaPaginada.last_page;

  const next_page_number =
    paginacaoNoServidor.respostaPaginada.current_page + 1 > last_page_number
      ? last_page_number
      : paginacaoNoServidor.respostaPaginada.current_page + 1;

  const previous_page_number =
    paginacaoNoServidor.respostaPaginada.current_page - 1 < 1
      ? 1
      : paginacaoNoServidor.respostaPaginada.current_page - 1;

  return (
    <div className="flex items-center gap-2">
      <div
        className="rounded border p-1"
        onClick={() => {
          window.location.href = serialize({
            page: Number(first_page_number),
          });
        }}
      >
        {"<<"}
      </div>
      <div
        className="rounded border p-1"
        onClick={() => {
          window.location.href = serialize({
            page: Number(previous_page_number),
          });
        }}
      >
        {"<"}
      </div>
      <div
        className="rounded border p-1"
        onClick={() => {
          window.location.href = serialize({
            page: Number(next_page_number),
          });
        }}
      >
        {">"}
      </div>
      <div
        className="rounded border p-1"
        onClick={() => {
          window.location.href = serialize({
            page: Number(last_page_number),
          });
        }}
      >
        {">>"}
      </div>
      <span className="flex items-center gap-1">
        <div>Página</div>
        <strong>
          {paginacaoNoServidor.respostaPaginada.current_page} de{" "}
          {last_page_number}
        </strong>
      </span>
      <span className="flex items-center gap-1">
        | Ir para página:
        <input
          type="number"
          defaultValue={paginacaoNoServidor.respostaPaginada.current_page}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) : 1;
            window.location.href = serialize({ page });
          }}
          className="w-16 rounded border p-1"
        />
      </span>
      <select
        value={paginacaoNoServidor.per_page}
        onChange={(e) => {
          window.location.href = serialize({
            page: 1,
            per_page: Number(e.target.value),
          });
        }}
      >
        {[10, 25, 50, 100, 500, 1000, 10000].map((pageSize, index) => (
          <option key={index} value={pageSize}>
            {`Mostrar ${pageSize}`}
          </option>
        ))}
      </select>
    </div>
  );
}

function ClientSidePagination(table: ReturnType<typeof useReactTable>) {
  return (
    <div className="flex items-center gap-2">
      <button
        className="rounded border p-1"
        onClick={() => table.setPageIndex(0)}
        disabled={!table.getCanPreviousPage()}
      >
        {"<<"}
      </button>
      <button
        className="rounded border p-1"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        {"<"}
      </button>
      <button
        className="rounded border p-1"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        {">"}
      </button>
      <button
        className="rounded border p-1"
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={!table.getCanNextPage()}
      >
        {">>"}
      </button>
      <span className="flex items-center gap-1">
        <div>Página</div>
        <strong>
          {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
        </strong>
      </span>
      <span className="flex items-center gap-1">
        | Ir para página:
        <input
          type="number"
          defaultValue={table.getState().pagination.pageIndex + 1}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0;
            table.setPageIndex(page);
          }}
          className="w-16 rounded border p-1"
        />
      </span>
      <select
        value={table.getState().pagination.pageSize}
        onChange={(e) => {
          table.setPageSize(Number(e.target.value));
        }}
      >
        {[10, 25, 50, 100, 500, 1000, 10000].map((pageSize, index) => (
          <option key={index} value={pageSize}>
            {`Mostrar ${pageSize}`}
          </option>
        ))}
      </select>
    </div>
  );
}

function Filter({ column }: { column: Column<any, unknown> }) {
  const { filterVariant } = column.columnDef.meta ?? {};

  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = React.useMemo(
    () =>
      filterVariant === "range"
        ? []
        : Array.from(column.getFacetedUniqueValues().keys())
            .sort()
            .slice(0, 5000),
    [column.getFacetedUniqueValues(), filterVariant],
  );

  return filterVariant === "range" ? (
    <div>
      <div className="flex space-x-2">
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(columnFilterValue as [number, number])?.[0] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder={`Mín ${
            column.getFacetedMinMaxValues()?.[0] !== undefined
              ? `(${column.getFacetedMinMaxValues()?.[0]})`
              : ""
          }`}
          className="border-1 w-full rounded border border-cinza-600"
        />
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(columnFilterValue as [number, number])?.[1] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder={`Máx ${
            column.getFacetedMinMaxValues()?.[1]
              ? `(${column.getFacetedMinMaxValues()?.[1]})`
              : ""
          }`}
          className="border-1 w-full rounded border border-cinza-600"
        />
      </div>
    </div>
  ) : filterVariant === "select" ? (
    <select
      onChange={(e) => column.setFilterValue(e.target.value)}
      value={columnFilterValue?.toString()}
    >
      <option value="">All</option>
      {sortedUniqueValues.map((value) => (
        // dynamically generated select options from faceted values feature
        <option value={value} key={value}>
          {value}
        </option>
      ))}
    </select>
  ) : (
    <>
      {/* Autocomplete suggestions from faceted values feature */}
      <datalist id={column.id + "list"}>
        {sortedUniqueValues.map((value, index) => (
          <option value={value} key={index} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? "") as string}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={`Buscar... (${column.getFacetedUniqueValues().size})`}
        className="border-1 w-full rounded border border-cinza-600"
        list={column.id + "list"}
      />
    </>
  );
}

// A typical debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
