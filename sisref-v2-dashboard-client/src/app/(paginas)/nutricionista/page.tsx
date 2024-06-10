import React from "react";

import { RelatoriosDeDesperdicio } from "@/app/elementos/modulos/RelatoriosDeDesperdicio";

interface NutricionistaPageProps {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function NutricionistaPage({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  params,
  searchParams
}: NutricionistaPageProps) {
  return (
    <RelatoriosDeDesperdicio data={searchParams.data?.toString()} />
  );
}