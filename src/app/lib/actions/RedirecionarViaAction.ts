import { redirect } from "next/navigation";

/**
 * Redireciona para a URL especificada.
 *
 * @param url - A URL para a qual redirecionar. Por padrão é "/login" se não for fornecida.
 * @scope Deve ser usado em Server Actions.
 */
export const redirecionarViaAction = (url = "/login") => redirect(url);
