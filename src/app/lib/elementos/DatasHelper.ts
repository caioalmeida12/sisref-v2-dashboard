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
   * Retorna a data de hoje no formato brasileiro, dd/MM/yyyy.
   *
   * @returns A data de hoje no formato brasileiro.
   * @example getHoje() // "13/04/2024"
   */
  static getDataDeHojeEmFormatoBrasileiro(): string {
    return new Date()
      .toISOString()
      .split("T")[0]
      .split("-")
      .reverse()
      .join("/");
  }

  /**
   * Retorna a data de hoje no formato ISO, yyyy-MM-dd.
   *
   * @returns A data de hoje no formato ISO.
   * @example getDataDeHoje() // "2024-04-13"
   */
  static getDataDeHoje(): string {
    return new Date().toISOString().split("T")[0];
  }

  /**
   * Remove os segundos de um horário.
   * @param horario - O horário.
   * @returns O horário sem os segundos.
   * @example removerSegundosDoHorario("12:00:00") // "12:00"
   */
  static removerSegundosDoHorario(horario: string): string {
    return horario.split(":").slice(0, 2).join(":");
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

    return (
      (dataHoraEmMilisegundos - dataHoraAtualEmMilisegundos) / (60000 * 60)
    );
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
    const dataAtual = new Date().toISOString().split("T")[0];
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
    return dataAtual.toISOString().split("T")[0];
  }

  /**
   * Retorna a data do dia posterior
   * @param data A data de referência no formato yyyy-MM-dd
   * @returns Data do dia posterior no formato yyyy-MM-dd
   */
  static getDataPosterior(data: string): string {
    const dataAtual = new Date(data);
    dataAtual.setDate(dataAtual.getDate() + 1);
    return dataAtual.toISOString().split("T")[0];
  }

  /**
   * Retorna a data base adicionada de n dias
   * @param data A data de referência no formato yyyy-MM-dd
   * @param dias_para_adicionar - Quantos dias adicionar à data base
   * @returns Data base adicionada de dias_para_adicionar no formato yyyy-MM-dd
   */
  static getDataNDiasDepois(data: string, dias_para_adicionar: number): string {
    const dataAtual = new Date(data);
    dataAtual.setDate(dataAtual.getDate() + dias_para_adicionar);
    return dataAtual.toISOString().split("T")[0];
  }

  /**
   * Retorna o mês anterior à data fornecida
   * @param data A data de referência no formato yyyy-MM-dd
   * @returns Data do mês anterior no formato yyyy-MM-dd
   * @example getMesAnterior("2024-04-13") // "2024-03-13"
   * @example getMesAnterior("2024-01-01") // "2023-12-01"
   */
  static getMesAnterior(data: string): string {
    const dataAtual = new Date(data);
    dataAtual.setDate(0);
    return dataAtual.toISOString().split("T")[0];
  }

  /**
   * Retorna o mês posterior à data fornecida
   * @param data A data de referência no formato yyyy-MM-dd
   * @returns Data do mês posterior no formato yyyy-MM-dd
   * @example getMesPosterior("2024-04-13") // "2024-05-13"
   * @example getMesPosterior("2024-12-31") // "2025-01-31"
   */
  static getMesPosterior(data: string): string {
    const dataAtual = new Date(data);
    const proximoMes = new Date(
      dataAtual.getFullYear(),
      dataAtual.getMonth() + 2,
      1,
    );
    return proximoMes.toISOString().split("T")[0];
  }

  /**
   * Aplica uma quantidade de horas ao horário fornecido e retorna o novo horário.
   * @param horario O horário de referência no formato hh:mm:ss
   * @param horas A quantidade de horas a serem aplicadas. Pode ser negativa ou positiva.
   * @returns O novo horário no formato hh:mm:ss
   *
   * @example aplicarHoras("12:00:00", 2) // "14:00:00"
   * @example aplicarHoras("12:00:00", -2) // "10:00:00"
   */
  static aplicarHoras(horario: string, horas: number): string {
    const [hh, mm, ss] = horario.split(":").map(Number);
    const dataAtual = new Date();
    dataAtual.setHours(hh, mm, ss);
    dataAtual.setHours(dataAtual.getHours() + horas);
    return dataAtual.toTimeString().split(" ")[0];
  }

  /**
   * Aplica uma quantidade de horas ao horário fornecido e retorna o novo horário em formato brasileiro.
   * @param horario O horário de referência no formato hh:mm:ss.
   * @param horas A quantidade de horas a serem aplicadas. Pode ser negativa ou positiva.
   * @returns O novo horário no formato hh:mm:ss.
   *
   * @example aplicarHorasFormatoBrasileiro("12:00:00", 2) // "14:00:00"
   * @example aplicarHorasFormatoBrasileiro("12:00:00", -2) // "10:00:00"
   */
  static aplicarHorasEmFormatoBrasileiro(
    horario: string,
    horas: number,
  ): string {
    return this.aplicarHoras(horario, horas);
  }
}
