"use client"

import React from 'react'
import {
    Column,
    ColumnDef,
    ColumnFiltersState,
    ColumnResizeDirection,
    ColumnResizeMode,
    RowData,
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

declare module '@tanstack/react-table' {
    interface ColumnMeta<TData extends RowData, TValue> {
        filterVariant?: 'text' | 'range' | 'select'
    }
}

export function TabelaDeCrud<TipoDeDado>({ colunas, dados }: { colunas: ColumnDef<TipoDeDado, any>[], dados: TipoDeDado[] }) {
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
                                    className='relative group px-[0.125em]'
                                >
                                    <div className="bg-preto-400 text-branco-400 rounded">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
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
                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
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
                                    className='px-2'
                                >
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
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
                    <div>Page</div>
                    <strong>
                        {table.getState().pagination.pageIndex + 1} of{' '}
                        {table.getPageCount()}
                    </strong>
                </span>
                <span className="flex items-center gap-1">
                    | Go to page:
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
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}

// function Filter({ column }: { column: Column<any, unknown> }) {
//     const { filterVariant } = column.columnDef.meta ?? {}

//     const columnFilterValue = column.getFilterValue()

//     const sortedUniqueValues = React.useMemo(
//         () =>
//             filterVariant === 'range'
//                 ? []
//                 : Array.from(column.getFacetedUniqueValues().keys())
//                     .sort()
//                     .slice(0, 5000),
//         [column.getFacetedUniqueValues(), filterVariant]
//     )

//     return filterVariant === 'range' ? (
//         <div>
//             <div className="flex space-x-2">
//                 <DebouncedInput
//                     type="number"
//                     min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
//                     max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
//                     value={(columnFilterValue as [number, number])?.[0] ?? ''}
//                     onChange={value =>
//                         column.setFilterValue((old: [number, number]) => [value, old?.[1]])
//                     }
//                     placeholder={`Min ${column.getFacetedMinMaxValues()?.[0] !== undefined
//                         ? `(${column.getFacetedMinMaxValues()?.[0]})`
//                         : ''
//                         }`}
//                     className="w-24 border shadow rounded"
//                 />
//                 <DebouncedInput
//                     type="number"
//                     min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
//                     max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
//                     value={(columnFilterValue as [number, number])?.[1] ?? ''}
//                     onChange={value =>
//                         column.setFilterValue((old: [number, number]) => [old?.[0], value])
//                     }
//                     placeholder={`Max ${column.getFacetedMinMaxValues()?.[1]
//                         ? `(${column.getFacetedMinMaxValues()?.[1]})`
//                         : ''
//                         }`}
//                     className="w-24 border shadow rounded"
//                 />
//             </div>
//             <div className="h-1" />
//         </div>
//     ) : filterVariant === 'select' ? (
//         <select
//             onChange={e => column.setFilterValue(e.target.value)}
//             value={columnFilterValue?.toString()}
//         >
//             <option value="">All</option>
//             {sortedUniqueValues.map(value => (
//                 <option value={value} key={value}>
//                     {value}
//                 </option>
//             ))}
//         </select>
//     ) : (
//         <>
//             <datalist id={column.id + 'list'}>
//                 {sortedUniqueValues.map((value: any, index) => (
//                     <option value={value} key={index} />
//                 ))}
//             </datalist>
//             <DebouncedInput
//                 type="text"
//                 value={(columnFilterValue ?? '') as string}
//                 onChange={value => column.setFilterValue(value)}
//                 placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
//                 className="w-36 border shadow rounded"
//                 list={column.id + 'list'}
//             />
//             <div className="h-1" />
//         </>
//     )
// }

// function DebouncedInput({
//     value: initialValue,
//     onChange,
//     debounce = 500,
//     ...props
// }: {
//     value: string | number
//     onChange: (value: string | number) => void
//     debounce?: number
// } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
//     const [value, setValue] = React.useState(initialValue)

//     React.useEffect(() => {
//         setValue(initialValue)
//     }, [initialValue])

//     React.useEffect(() => {
//         const timeout = setTimeout(() => {
//             onChange(value)
//         }, debounce)

//         return () => clearTimeout(timeout)
//     }, [value])

//     return (
//         <input {...props} value={value} onChange={e => setValue(e.target.value)} />
//     )
// }