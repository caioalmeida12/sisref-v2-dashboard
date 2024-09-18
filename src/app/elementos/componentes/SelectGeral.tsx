import { ChevronDownIcon } from "@radix-ui/react-icons";
import * as Select from "@radix-ui/react-select";

interface ISelectProps {
    name: string;
    label: string;
    opcoes: () => {
        valor: string | number;
        texto: string | number;
    }[],
    estaCarregando?: boolean;
}

export const SelectGeral = ({ name, label, opcoes, estaCarregando }: ISelectProps) => {
    const opcoesArray = opcoes();

    return (
        <fieldset className='flex flex-col gap-y-2 justify-start'>
            <label className='font-medium' htmlFor={name}>
                {label}
            </label>
            <Select.Root name={name}>
                <Select.Trigger className="h-fit min-h-[34px] disabled:text-cinza-600 disabled:cursor-not-allowed px-2 py-1 flex overflow-hidden items-center min-w-[250px] text-left rounded outline outline-1 outline-preto-400" disabled={estaCarregando || opcoesArray.length === 0}>
                    <Select.Value placeholder={estaCarregando ? "Carregando..." : (opcoesArray.length === 0 ? "Nenhuma opção disponível" : "Selecione a opção desejada")} />
                    <Select.Icon>
                        <ChevronDownIcon />
                    </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                    <Select.Content>
                        <Select.ScrollUpButton />
                        <Select.Viewport className="p-3 rounded outline outline-1 outline-cinza-600 bg-branco-400 max-w-md flex flex-col gap-y-2">
                            {
                                estaCarregando ? (
                                    <Select.Item
                                        className="relative border border-cinza-600 cursor-not-allowed flex items-center px-2 py-1 rounded bg-cinza-200"
                                        value="loading"
                                        disabled
                                    >
                                        <Select.ItemText>Carregando...</Select.ItemText>
                                    </Select.Item>
                                ) : opcoesArray.length === 0 ? (
                                    <Select.Item
                                        className="relative border border-cinza-600 cursor-not-allowed flex items-center px-2 py-1 rounded bg-cinza-200"
                                        value="no-options"
                                        disabled
                                    >
                                        <Select.ItemText>Nenhuma opção disponível.</Select.ItemText>
                                    </Select.Item>
                                ) : (
                                    opcoesArray.map((opcao, index) => (
                                        <Select.Item
                                            className="relative border border-cinza-600 cursor-pointer flex items-center px-2 py-1 hover:outline outline-1 rounded hover:bg-amarelo-200 data-[state=checked]:bg-verde-300/25"
                                            key={`${opcao.valor}-${index}`}
                                            value={String(opcao.valor)}
                                        >
                                            <Select.ItemText>{opcao.texto}</Select.ItemText>
                                        </Select.Item>
                                    ))
                                )
                            }
                        </Select.Viewport>
                        <Select.ScrollDownButton className="flex items-center justify-center bg-branco-400 cursor-default">
                            <ChevronDownIcon />
                        </Select.ScrollDownButton>
                    </Select.Content>
                </Select.Portal>
            </Select.Root>
        </fieldset>
    );
};