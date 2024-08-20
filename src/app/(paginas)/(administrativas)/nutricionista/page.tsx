"use client"

import React, { useState } from "react";

import { Secao } from "@/app/elementos/basicos/Secao";
import { CabecalhoDeSecao } from "@/app/elementos/basicos/CabecalhoDeSecao";
import { Botao } from "@/app/elementos/basicos/Botao";
import * as Form from '@radix-ui/react-form';
import * as Select from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { DatasHelper } from "@/app/lib/elementos/DatasHelper";
import { IRefeicao } from "@/app/elementos/interfaces/IRefeicao";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchRefeicoesNutricionista } from "@/app/actions/fetchRefeicoesNutricionista";

interface NutricionistaPageProps {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

const searchParamsToURLSearchParams = (searchParams: { [key: string]: string | string[] | undefined }): URLSearchParams => {
  const urlSearchParams = new URLSearchParams()
  for (const key in searchParams) {
    if (searchParams[key] !== undefined) {
      urlSearchParams.set(key, searchParams[key] as string)
    }
  }
  return urlSearchParams
}

export default function NutricionistaPage({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  params,
  searchParams
}: NutricionistaPageProps) {

  // Sempre passar um novo objeto para evitar mutações
  const passarSearchParams = () => new URLSearchParams(searchParamsToURLSearchParams(searchParams).toString())

  // As datas são armazenadas no formato  yyyy-MM-dd
  const [datas, setDatas] = useState<{ dataInicial: string, dataFinal: string }>({
    dataInicial: new Date().toISOString().split('T')[0],
    dataFinal: new Date().toISOString().split('T')[0]
  })

  const queryClient = useQueryClient()

  const { data: refeicoes, isLoading } = useQuery({
    queryKey: ['refeicoes', datas],
    queryFn: () => fetchRefeicoesNutricionista(datas)
  });

  return (
    <>
      <Secao className="border-none">
        <Secao className="max-w-[1440px] mx-auto flex flex-col gap-y-4">
          <CabecalhoDeSecao titulo="Refeições" />
          <Secao className="flex">
            <div className="flex gap-x-4 items-end">
              <Form.Root className="flex">
                <Form.Field name="dataInicial" className="flex flex-col gap-y-2">
                  <Form.Label className="font-bold">
                    Data Inicial
                  </Form.Label>
                  <Form.Control type="date" className="px-2 py-1 rounded outline outline-1 outline-cinza-600" defaultValue={datas.dataInicial} />
                </Form.Field>
                <Form.Submit />
              </Form.Root>
              <Form.Root className="flex">
                <Form.Field name="dataInicial" className="flex flex-col gap-y-2">
                  <Form.Label className="font-bold">
                    Data Final
                  </Form.Label>
                  <Form.Control type="date" className="px-2 py-1 rounded outline outline-1 outline-cinza-600" defaultValue={datas.dataFinal} />
                </Form.Field>
                <Form.Submit />
              </Form.Root>
              <div className="flex flex-col gap-y-2">
                <label className="font-bold">Refeição</label>
                <Select.Root>
                  <Select.Trigger className="px-2 py-1 h-[34px] flex overflow-hidden items-center min-w-[250px] text-left rounded outline outline-1 outline-cinza-600">
                    <Select.Value placeholder="Todas as refeições" defaultValue={"0"} />
                    <Select.Icon className="SelectIcon">
                      <ChevronDownIcon />
                    </Select.Icon>
                  </Select.Trigger>

                  <Select.Portal>
                    <Select.Content>
                      <Select.ScrollUpButton />
                      <Select.Viewport className="bg-branco-400 px-2 py-1 rounded outline outline-1 outline-cinza-600">
                        <Select.Item value={"0"} className="flex items-center px-2 py-1 hover:outline outline-1 rounded hover:bg-amarelo-200">
                          <Select.ItemText>
                            Todas as refeições
                          </Select.ItemText>
                          <Select.ItemIndicator>
                            <CheckIcon />
                          </Select.ItemIndicator>
                        </Select.Item>
                        {
                          !isLoading && refeicoes &&
                          refeicoes.map((refeicao, index) => (
                            <Select.Item value={String(refeicao?.id)} className="flex items-center px-2 py-1 hover:outline outline-1 rounded hover:bg-amarelo-200" key={index}>
                              <Select.ItemText>
                                {refeicao?.description}
                              </Select.ItemText>
                              <Select.ItemIndicator>
                                <CheckIcon />
                              </Select.ItemIndicator>
                            </Select.Item>
                          ))
                        }

                      </Select.Viewport>
                      <Select.ScrollDownButton />
                      <Select.Arrow />
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>
              <Botao variante="adicionar" texto="Buscar" className="h-[36px] py-0 px-10" />
            </div>
          </Secao>
        </Secao>
      </Secao>
    </>
  );
}