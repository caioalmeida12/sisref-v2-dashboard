export class DatasHelper {
    /**
     * Converte a data fornecida no formato yyyy-MM-dd para o formato dd/MM/yyyy.
     * @param data - A data no formato yyyy-MM-dd.
     * @returns A data convertida no formato dd/MM/yyyy.
     * @example converterDataParaBR("2024-04-13") // "13/04/2024"
     */
    static converterParaFormatoBrasileiro(data: string): string {
        return data.split("-").reverse().join("/");
    }

    /**
     * Converte a data fornecida no formato dd/MM/yyyy para o formato yyyy-MM-dd.
     * @param data - A data no formato dd/MM/yyyy.
     * @returns A data convertida no formato yyyy-MM-dd.
     * @example converterDataParaISO("13/04/2024") // "2024-04-13"
     */
    static converterDataParaISO(data: string): string {
        return data.split("/").reverse().join("-");
    }


    /**
     * Compila a data fornecida no formato dd/MM/yyyy e o horário fornecido no formato HH:mm:ss em uma string de data e hora.
     * @param data - A data no formato dd/MM/yyyy.
     * @param hora - A hora no formato HH:mm:ss.
     * @returns A data e hora compiladas.
     * @example compilarDataHora("2024/04/13", "12:00:00") // "2024-04-13T12:00:00"
     */
    static compilarDataHora(data: string, hora: string): string {
        return `${this.converterDataParaISO(data)}T${hora}`;
    }

    /**
 * Compara quantas horas faltam para a data e hora fornecidas em relação à data e hora atuais.
 * @param dataHora - A data e hora no formato yyyy-MM-ddTHH:mm:ss.
 * @returns A diferença em horas.
 * @example getDiferencaEmHoras("2024-04-13T12:00:00") // 24
 * @example getDiferencaEmHoras("2024-04-13T12:00:00") // -24
 * @example getDiferencaEmHoras("2024-04-13T12:00:00") // 0
 */
    static getDiferencaEmHoras(dataHora: string): number {
        const dataHoraEmMilisegundos = new Date(dataHora).getTime();
        const dataHoraAtualEmMilisegundos = new Date().getTime();

        return (dataHoraEmMilisegundos - dataHoraAtualEmMilisegundos) / (60000 * 60);
    }
}