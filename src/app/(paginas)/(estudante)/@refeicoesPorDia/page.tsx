"use client";
import React, { use } from "react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { CustomQueryClientProvider } from "@/app/lib/elementos/CustomQueryProviderWrapper";
import { RefeicoesPorDia } from "@/app/elementos/modulos/estudante/RefeicoesPorDia";

export default function RefeicoesPorDiaParallelPage(
  props: {
    params: Promise<{ slug: string }>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
  }
) {
  const searchParams = use(props.searchParams);
  const params = use(props.params);
  return (
    <CustomQueryClientProvider>
      <RefeicoesPorDia
        forcarExibicao={
          searchParams?.pagina === "refeicoesPorDia" ||
          searchParams?.pagina == undefined
        }
      />
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </CustomQueryClientProvider>
  );
}
