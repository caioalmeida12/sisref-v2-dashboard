import { ITabelaDeCrudProps } from "./TabelaDeCrud";
import { debounce } from "lodash";

export function PaginacaoNoServidor({
  paginacaoNoServidor,
  desligarNavegacao,
}: {
  paginacaoNoServidor: NonNullable<
    ITabelaDeCrudProps<any>["paginacaoNoServidor"]
  >;
  desligarNavegacao: boolean;
}) {
  const first_page_number = 1;

  const last_page_number = paginacaoNoServidor.paginacao.last_page;

  const next_page_number =
    paginacaoNoServidor.paginacao.page + 1 > last_page_number
      ? last_page_number
      : paginacaoNoServidor.paginacao.page + 1;

  const previous_page_number =
    paginacaoNoServidor.paginacao.page - 1 < 1
      ? 1
      : paginacaoNoServidor.paginacao.page - 1;

  const setPaginacao = ({
    page,
    per_page,
  }: {
    page: number;
    per_page?: number;
  }) => {
    const cappedPage = Math.max(
      1,
      Math.min(page, paginacaoNoServidor.paginacao.last_page),
    );
    paginacaoNoServidor.setPaginacao({
      ...paginacaoNoServidor.paginacao,
      page: cappedPage,
      per_page: per_page || paginacaoNoServidor.paginacao.per_page,
    });
  };

  const debouncedSetPaginacao = debounce(setPaginacao, 500, {
    leading: false,
    trailing: true,
  });

  return (
    <div className="flex items-center gap-2">
      <button
        className="rounded border p-1"
        onClick={() =>
          !desligarNavegacao &&
          debouncedSetPaginacao({ page: first_page_number })
        }
        disabled={desligarNavegacao}
      >
        {"<<"}
      </button>
      <button
        className="rounded border p-1"
        onClick={() =>
          !desligarNavegacao &&
          debouncedSetPaginacao({ page: previous_page_number })
        }
        disabled={desligarNavegacao}
      >
        {"<"}
      </button>
      <button
        className="rounded border p-1"
        onClick={() =>
          !desligarNavegacao &&
          debouncedSetPaginacao({ page: next_page_number })
        }
        disabled={desligarNavegacao}
      >
        {">"}
      </button>
      <button
        className="rounded border p-1"
        onClick={() =>
          !desligarNavegacao &&
          debouncedSetPaginacao({ page: last_page_number })
        }
        disabled={desligarNavegacao}
      >
        {">>"}
      </button>
      <span className="flex items-center gap-1">
        <div>Página</div>
        <strong>
          {paginacaoNoServidor.paginacao.page} de {last_page_number}
        </strong>
      </span>
      <span className="flex items-center gap-1">
        | Ir para página:
        <input
          type="number"
          defaultValue={paginacaoNoServidor.paginacao.page}
          min={1}
          max={paginacaoNoServidor.paginacao.last_page}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) : 1;
            !desligarNavegacao && debouncedSetPaginacao({ page });
          }}
          className="w-16 rounded border p-1"
          disabled={desligarNavegacao}
        />
      </span>
      <select
        value={paginacaoNoServidor.paginacao.per_page}
        onChange={(e) =>
          !desligarNavegacao &&
          setPaginacao({
            page: 1,
            per_page: Number(e.target.value),
          })
        }
        disabled={desligarNavegacao}
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
