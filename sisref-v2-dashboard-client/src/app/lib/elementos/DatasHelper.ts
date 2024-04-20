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

    /**
     * Compara quantos dias faltam para a data fornecida em relação à data atual.
     * @param data - A data no formato yyyy-MM-dd.
     * @returns A diferença em dias.
     * @example getDiferencaEmDias("2024-04-13") // 24
     * @example getDiferencaEmDias("2024-04-13") // -24
     * @example getDiferencaEmDias("2024-04-13") // 0
     */
    static getDiferenciaEmDias(data: string): number {
        const dataAtual = new Date().toISOString().split('T')[0];
        return this.calcularDiferencaEmDias(dataAtual, data);
    }

    /**
     * Calcula a diferença em dias entre duas datas
     * @param data1 A primeira data no formato yyyy-MM-dd
     * @param data2 A segunda data no formato yyyy-MM-dd
     * @returns A diferença em dias, sendo positiva se a segunda data for maior que a primeira e negativa se a primeira data for maior que a segunda
     */
    static calcularDiferencaEmDias(data1: string, data2: string): number {
        const data1EmMilisegundos = new Date(data1).getTime();
        const data2EmMilisegundos = new Date(data2).getTime();

        return (data2EmMilisegundos - data1EmMilisegundos) / (60000 * 60 * 24);
    }

    /**
     * Retorna a data do dia anterior
     * @param data A data de referência no formato yyyy-MM-dd
     * @returns Data do dia anterior no formato yyyy-MM-dd
     */
    static getDataAnterior(data: string): string {
        const dataAtual = new Date(data);
        dataAtual.setDate(dataAtual.getDate() - 1);
        return dataAtual.toISOString().split('T')[0];
    }

    /**
     * Retorna a data do dia posterior
     * @param data A data de referência no formato yyyy-MM-dd
     * @returns Data do dia posterior no formato yyyy-MM-dd
     */
    static getDataPosterior(data: string): string {
        const dataAtual = new Date(data);
        dataAtual.setDate(dataAtual.getDate() + 1);
        return dataAtual.toISOString().split('T')[0];
    }
}