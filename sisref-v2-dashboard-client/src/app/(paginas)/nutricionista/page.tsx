import { RelatoriosDeDesperdicio } from "@/app/elementos/modulos/RelatoriosDeDesperdicio";

interface NutricionistaPageProps {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function NutricionistaPage({params, searchParams}: NutricionistaPageProps) {
  return (
    <RelatoriosDeDesperdicio data={searchParams.data?.toString()} />
  );
}