import { ChevronDownIcon } from "@radix-ui/react-icons";
import * as Select from "@radix-ui/react-select";
import classNames from "classnames";

interface ISelectProps {
  name: string;
  label: string;
  opcoes: () => {
    valor: string | number;
    texto: string | number;
  }[];
  estaCarregando?: boolean;
  triggerClassname?: string;
}

export const SelectGeral = ({
  name,
  label,
  opcoes,
  estaCarregando,
  triggerClassname,
}: ISelectProps) => {
  const opcoesArray = opcoes();

  return (
    <fieldset className="flex flex-col justify-start gap-y-2">
      <label className="font-medium" htmlFor={name}>
        {label}
      </label>
      <Select.Root name={name}>
        <Select.Trigger
          className={classNames(
            "flex h-fit min-h-[34px] min-w-[250px] items-center overflow-hidden rounded px-2 py-1 text-left outline outline-1 outline-preto-400 disabled:cursor-not-allowed disabled:text-cinza-600",
            triggerClassname,
          )}
          disabled={estaCarregando || opcoesArray.length === 0}
        >
          <Select.Value
            placeholder={
              estaCarregando
                ? "Carregando..."
                : opcoesArray.length === 0
                  ? "Nenhuma opção disponível"
                  : "Selecione a opção desejada"
            }
          />
          <Select.Icon>
            <ChevronDownIcon />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content>
            <Select.ScrollUpButton />
            <Select.Viewport className="flex max-w-md flex-col gap-y-2 rounded bg-branco-400 p-3 outline outline-1 outline-cinza-600">
              {estaCarregando ? (
                <Select.Item
                  className="bg-cinza-200 relative flex cursor-not-allowed items-center rounded border border-cinza-600 px-2 py-1"
                  value="loading"
                  disabled
                >
                  <Select.ItemText>Carregando...</Select.ItemText>
                </Select.Item>
              ) : opcoesArray.length === 0 ? (
                <Select.Item
                  className="bg-cinza-200 relative flex cursor-not-allowed items-center rounded border border-cinza-600 px-2 py-1"
                  value="no-options"
                  disabled
                >
                  <Select.ItemText>Nenhuma opção disponível.</Select.ItemText>
                </Select.Item>
              ) : (
                opcoesArray.map((opcao, index) => (
                  <Select.Item
                    className="relative flex cursor-pointer items-center rounded border border-cinza-600 px-2 py-1 outline-1 hover:bg-amarelo-200 hover:outline data-[state=checked]:bg-verde-300/25"
                    key={`${opcao.valor}-${index}`}
                    value={String(opcao.valor)}
                  >
                    <Select.ItemText>{opcao.texto}</Select.ItemText>
                  </Select.Item>
                ))
              )}
            </Select.Viewport>
            <Select.ScrollDownButton className="flex cursor-default items-center justify-center bg-branco-400">
              <ChevronDownIcon />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </fieldset>
  );
};
