"use client"

import React from 'react'
import {
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
} from '@tanstack/react-table'
import Skeleton from 'react-loading-skeleton'

export function TabelaDeCrud<TipoDeDado>({ colunas, dados, estaCarregando }: { colunas: ColumnDef<TipoDeDado, any>[], dados: TipoDeDado[], estaCarregando?: boolean }) {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }[]>([{
        id: 'id',
        desc: true,
    }])
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 50,
    })
    const [columnResizeMode, _setColumnResizeMode] =
        React.useState<ColumnResizeMode>('onChange')

    const [columnResizeDirection, _setColumnResizeDirection] =
        React.useState<ColumnResizeDirection>('ltr')

    const table = useReactTable({
        data: dados,
        columns: colunas,
        state: {
            columnFilters,
            sorting,
            pagination
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
        debugTable: true,
        debugHeaders: true,
        debugColumns: false,
    })

    return (
        <div className="p-2 max-w-full overflow-x-auto">
            <table
                className='text-center w-full max-w-full'
            >
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id} >
                            {headerGroup.headers.map(header => (
                                <th
                                    key={header.id}
                                    colSpan={header.colSpan}
                                    className='relative group px-[0.125em] cursor-pointer [&:first-of-type]:pl-0 [&:last-of-type]:pr-0'
                                    onClick={() => {
                                        const isDesc = sorting.find(sort => sort.id === header.id)?.desc
                                        setSorting([{ id: header.id, desc: !isDesc }])
                                    }}
                                >
                                    <div
                                        className={
                                            header.column.getCanSort()
                                                ? 'cursor-pointer select-none bg-preto-400 text-branco-400 rounded'
                                                : 'bg-preto-400 text-branco-400 rounded'
                                        }
                                        onClick={header.column.getToggleSortingHandler()}
                                        title={
                                            header.column.getCanSort()
                                                ? header.column.getNextSortingOrder() === 'asc'
                                                    ? 'Crescente'
                                                    : header.column.getNextSortingOrder() === 'desc'
                                                        ? 'Decrescente'
                                                        : 'Limpar ordenação'
                                                : undefined
                                        }
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                        {{
                                            asc: ' 🔼',
                                            desc: ' 🔽',
                                        }[header.column.getIsSorted() as string] ?? null}
                                    </div>
                                    {
                                        header.column.getCanResize() && (
                                            <div
                                                onDoubleClick={() => header.column.resetSize()}
                                                onMouseDown={header.getResizeHandler()}
                                                onTouchStart={header.getResizeHandler()}
                                                className={`opacity-0 group-hover:opacity-100 absolute right-0 inset-y-0 w-1 rounded bg-cinza-600/75 cursor-col-resize select-none touch-none ${table.options.columnResizeDirection} ${header.column.getIsResizing() ? 'isResizing' : ''}`}
                                                style={{
                                                    transform:
                                                        columnResizeMode === 'onEnd' &&
                                                            header.column.getIsResizing()
                                                            ? `translateX(${(table.options.columnResizeDirection === 'rtl' ? -1 : 1) * (table.getState().columnSizingInfo.deltaOffset ?? 0)}px)`
                                                            : '',
                                                }}
                                            />
                                        )
                                    }
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody className="block py-[.125em]"></tbody>
                <tbody>
                    {estaCarregando ? (
                        Array.from({ length: 10 }).map((_, index) => (
                            <tr key={index}>
                                {
                                    colunas.map((_coluna, index) => (
                                        <td key={index} className='px-[.125em] [&:first-of-type]:pl-0 [&:last-of-type]:pr-0'>
                                            <Skeleton className='h-5' />
                                        </td>
                                    ))
                                }
                            </tr>
                        ))
                    ) : dados.length === 0 ? (
                        <tr className='hover:!bg-amarelo-200/75'>
                            <td colSpan={colunas.length} className='text-center bg-cinza-400 rounded'>
                                Nenhum dado encontrado
                            </td>
                        </tr>
                    ) : (
                        table.getRowModel().rows.map(row => (
                            <tr
                                key={row.id}
                                className='[&:nth-of-type(odd)]:bg-cinza-400 hover:!bg-amarelo-200/75'
                            >
                                {row.getVisibleCells().map(cell => (
                                    <td
                                        key={cell.id}
                                        style={{
                                            width: cell.column.getSize(),
                                        }}
                                        className='px-2 [&:first-of-type]:rounded-tl [&:first-of-type]:rounded-bl [&:last-of-type]:rounded-tr [&:last-of-type]:rounded-br'
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <div className="h-2" />
            <div className="flex items-center gap-2">
                <button
                    className="border rounded p-1"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'<<'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'<'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    {'>'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                >
                    {'>>'}
                </button>
                <span className="flex items-center gap-1">
                    <div>Página</div>
                    <strong>
                        {table.getState().pagination.pageIndex + 1} de{' '}
                        {table.getPageCount()}
                    </strong>
                </span>
                <span className="flex items-center gap-1">
                    | Ir para página:
                    <input
                        type="number"
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            table.setPageIndex(page)
                        }}
                        className="border p-1 rounded w-16"
                    />
                </span>
                <select
                    value={table.getState().pagination.pageSize}
                    onChange={e => {
                        table.setPageSize(Number(e.target.value))
                    }}
                >
                    {[10, 25, 50, 100, dados.length].map((pageSize, index) => (
                        <option key={index} value={pageSize}>
                            {
                                pageSize === dados.length ? 'Todos' : `Mostrar ${pageSize}`
                            }
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}