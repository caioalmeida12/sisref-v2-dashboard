import React, { forwardRef } from "react";
import classnames from "classnames";

import { ButtonHTMLAttributes } from "react";

interface BotaoProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  texto: string;
  variante: "adicionar" | "remover" | "editar" | "ocultar";
}

const classNamePorVariante = {
  adicionar: "bg-verde-300 hover:outline-verde-400",
  remover:
    "bg-branco-400 border-vermelho-400 border-[1px] text-vermelho-400 hover:outline-vermelho-400",
  editar: "bg-cinza-600 text-branco-400 hover:outline-preto-400",
  ocultar: "bg-branco-400 text-preto-400 hover:outline-preto-400",
};

export const Botao = forwardRef<HTMLButtonElement, BotaoProps>(
  ({ texto, variante, className, disabled, ...rest }, ref) => {
    return (
      <button
        {...rest}
        ref={ref}
        className={classnames(
          `h-fit w-full rounded-md p-4 font-bold text-branco-400 outline-2 hover:animate-outline hover:outline`,
          classNamePorVariante[variante],
          className,
          { "cursor-not-allowed opacity-50": disabled },
        )}
        disabled={disabled}
      >
        {texto}
      </button>
    );
  },
);

Botao.displayName = "Botao";
