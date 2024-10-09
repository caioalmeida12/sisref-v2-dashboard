import { createSerializer, parseAsInteger } from "nuqs";
import { ITabelaDeCrudProps } from "./TabelaDeCrud";

export function PaginacaoNoServidor(
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
