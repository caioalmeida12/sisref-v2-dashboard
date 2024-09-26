import React from "react";
import classnames from "classnames";

import { HTMLAttributes } from "react";

interface SecaoProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Secao: React.FC<SecaoProps> = ({
  children,
  ...rest
}: SecaoProps) => {
  return (
    <section
      {...rest}
      className={classnames(
        "rounded border-[1px] border-cinza-600 bg-branco-400 p-4",
        rest.className,
      )}
    >
      {children}
    </section>
  );
};
