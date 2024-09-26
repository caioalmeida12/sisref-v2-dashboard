import React from "react";

import { HTMLAttributes } from "react";
import classnames from "classnames";

interface CabecalhoDeSecaoProps extends HTMLAttributes<HTMLElement> {
  titulo: string;
}

export const CabecalhoDeSecao = ({
  titulo,
  className,
  ...rest
}: CabecalhoDeSecaoProps) => {
  return (
    <header
      {...rest}
      className={classnames("rounded bg-preto-400 p-4", className)}
    >
      <h2 className="text-center font-bold text-branco-400">{titulo}</h2>
    </header>
  );
};
