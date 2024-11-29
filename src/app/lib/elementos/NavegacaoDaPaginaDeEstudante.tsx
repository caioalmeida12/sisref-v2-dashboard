"use client";

import { parseAsBoolean, parseAsString, useQueryStates } from "nuqs";

export const useNavegacaoDaPaginaDeEstudante = () => {
  return useQueryStates(
    {
      pagina: parseAsString.withDefault("refeicoesPorDia"),
      isMobile: parseAsBoolean.withDefault(false),
    },
    {
      clearOnDefault: true,
    },
  );
};
