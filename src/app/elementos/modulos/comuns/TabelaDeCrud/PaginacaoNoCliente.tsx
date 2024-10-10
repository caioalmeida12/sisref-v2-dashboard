import { useReactTable } from "@tanstack/react-table";

export function PaginacaoNoCliente(table: ReturnType<typeof useReactTable>) {
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
