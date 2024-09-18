"use client"

import React from 'react'
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
} from '@tanstack/react-table'
import Skeleton from 'react-loading-skeleton'

declare module '@tanstack/react-table' {
    interface ColumnMeta<TData extends RowData, TValue> {
        filterVariant?: 'text' | 'range' | 'select'
    }
}

interface ITabelaDeCrudProps<TipoDeDado> {
    colunas: ColumnDef<TipoDeDado, any>[]
    dados: TipoDeDado[]
    estaCarregando?: boolean
    ordenacaoPadrao?: { id: string; desc: boolean }[]
}

export function TabelaDeCrud<TipoDeDado>({ colunas, dados, estaCarregando, ordenacaoPadrao }: ITabelaDeCrudProps<TipoDeDado>) {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }[]>(ordenacaoPadrao ?? [])
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
        debugTable: false,
        debugHeaders: true,
        debugColumns: false,
        debugAll: false,
    })

    console.log(dados)

    return (
        <div className="p-2 max-w-full overflow-x-auto">
            <table
                className='text-center w-full max-w-full'
            >
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <React.Fragment key={headerGroup.id}>
                            <tr>
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        colSpan={header.colSpan}
                                        className='relative group px-[0.125em] cursor-pointer [&:first-of-type]:pl-0 [&:last-of-type]:pr-0 h-1'
                                        onClick={() => {
                                            const isDesc = sorting.find(sort => sort.id === header.id)?.desc
                                            setSorting([{ id: header.id, desc: !isDesc }])
                                        }}
                                    >
                                        <div
                                            className={
                                                header.column.getCanSort()
                                                    ? 'h-full flex flex-col justify-center cursor-pointer select-none bg-preto-400 text-branco-400 rounded'
                                                    : 'h-full flex flex-col justify-center bg-preto-400 text-branco-400 rounded'
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
                            <tr>
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        colSpan={header.colSpan}
                                        className='relative group px-[0.125em] cursor-pointer [&:first-of-type]:pl-0 [&:last-of-type]:pr-0 h-1'
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

function Filter({ column }: { column: Column<any, unknown> }) {
    const { filterVariant } = column.columnDef.meta ?? {}

    const columnFilterValue = column.getFilterValue()

    const sortedUniqueValues = React.useMemo(
        () =>
            filterVariant === 'range'
                ? []
                : Array.from(column.getFacetedUniqueValues().keys())
                    .sort()
                    .slice(0, 5000),
        [column.getFacetedUniqueValues(), filterVariant]
    )

    return filterVariant === 'range' ? (
        <div>
            <div className="flex space-x-2">
                <DebouncedInput
                    type="number"
                    min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
                    max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
                    value={(columnFilterValue as [number, number])?.[0] ?? ''}
                    onChange={value =>
                        column.setFilterValue((old: [number, number]) => [value, old?.[1]])
                    }
                    placeholder={`Mín ${column.getFacetedMinMaxValues()?.[0] !== undefined
                        ? `(${column.getFacetedMinMaxValues()?.[0]})`
                        : ''
                        }`}
                    className="w-full border border-1 border-cinza-600 rounded"
                />
                <DebouncedInput
                    type="number"
                    min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
                    max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
                    value={(columnFilterValue as [number, number])?.[1] ?? ''}
                    onChange={value =>
                        column.setFilterValue((old: [number, number]) => [old?.[0], value])
                    }
                    placeholder={`Máx ${column.getFacetedMinMaxValues()?.[1]
                        ? `(${column.getFacetedMinMaxValues()?.[1]})`
                        : ''
                        }`}
                    className="w-full border border-1 border-cinza-600 rounded"
                />
            </div>
        </div>
    ) : filterVariant === 'select' ? (
        <select
            onChange={e => column.setFilterValue(e.target.value)}
            value={columnFilterValue?.toString()}
        >
            <option value="">All</option>
            {sortedUniqueValues.map(value => (
                //dynamically generated select options from faceted values feature
                <option value={value} key={value}>
                    {value}
                </option>
            ))}
        </select>
    ) : (
        <>
            {/* Autocomplete suggestions from faceted values feature */}
            <datalist id={column.id + 'list'}>
                {sortedUniqueValues.map((value: any) => (
                    <option value={value} key={value} />
                ))}
            </datalist>
            <DebouncedInput
                type="text"
                value={(columnFilterValue ?? '') as string}
                onChange={value => column.setFilterValue(value)}
                placeholder={`Buscar... (${column.getFacetedUniqueValues().size})`}
                className="w-full border border-1 border-cinza-600 rounded"
                list={column.id + 'list'}
            />
        </>
    )
}

// A typical debounced input react component
function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}: {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)

        return () => clearTimeout(timeout)
    }, [value])

    return (
        <input {...props} value={value} onChange={e => setValue(e.target.value)} />
    )
}