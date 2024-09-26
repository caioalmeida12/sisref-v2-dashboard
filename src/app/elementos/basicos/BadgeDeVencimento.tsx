"use client";

import { DatasHelper } from "@/app/lib/elementos/DatasHelper";
import classnames from "classnames";
import { CustomTooltipWrapper } from "./CustomTooltipWrapper";

export const BadgeDeVencimento = ({
  data,
  className,
}: {
  data: string;
  className?: string;
}) => {
  const diferenca = DatasHelper.getDiferenciaEmDias(data);

  // Caso falte 1 mês ou menos -> amarelo, caso falte 7 dias ou menos -> vermelho
  let cor = "bg-verde-300";
  if (diferenca < 30) cor = "bg-amarelo-200";
  if (diferenca < 7) cor = "bg-vermelho-400";

  return (
    <CustomTooltipWrapper
      elementoTrigger={
        <span
          className={classnames(
            "whitespace-nowrap rounded px-4 font-bold text-branco-400",
            cor,
            className,
          )}
        >
          {data}
        </span>
      }
      elementoContent={
        <span>
          {diferenca > 0
            ? `Faltam ${diferenca} dias para o vencimento do código.`
            : diferenca === 0
              ? "O código se vence hoje."
              : `O código está vencido há ${Math.abs(diferenca)} dias.`}
        </span>
      }
    />
  );
};
