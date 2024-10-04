import React, { forwardRef, HTMLAttributes } from "react";
import classnames from "classnames";

interface BotaoProps extends HTMLAttributes<HTMLDivElement> {
  texto: string;
  variante: "adicionar" | "remover" | "editar" | "ocultar";
  disabled?: boolean;
}

const classNamePorVariante = {
  adicionar: "bg-verde-300 hover:outline-verde-400",
  remover:
    "bg-branco-400 border-vermelho-400 border-[1px] text-vermelho-400 hover:outline-vermelho-400",
  editar: "bg-cinza-600 text-branco-400 hover:outline-preto-400",
  ocultar: "bg-branco-400 text-preto-400 hover:outline-preto-400",
};

export const BotaoDiv = forwardRef<HTMLDivElement, BotaoProps>(
  ({ texto, variante, className, disabled, onClick, ...rest }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (!disabled && onClick) {
        onClick(e);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if ((e.key === "Enter" || e.key === " ") && !disabled) {
        handleClick(e as any);
      }
    };

    return (
      <div
        {...rest}
        ref={ref}
        className={classnames(
          `h-fit w-full rounded-md p-4 font-bold text-branco-400 outline-2 hover:animate-outline hover:outline`,
          classNamePorVariante[variante],
          className,
          { "cursor-not-allowed opacity-50": disabled },
        )}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {texto}
      </div>
    );
  },
);

BotaoDiv.displayName = "BotaoDiv";
