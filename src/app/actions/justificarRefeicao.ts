"use server"

import { cookies } from "next/headers"
import { redirecionarViaAction } from "../lib/actions/RedirecionarViaAction"
import { mensagemDeErroPorCodigoHTTP } from "../lib/actions/MensagemDeErroPorCodigoHTTP"
import { IJustificativaDeEstudante, justificativasPermitidas } from "../elementos/interfaces/IJustificativaDeEstudante"
import { IRefeicao } from "../elementos/interfaces/IRefeicao"
import { FetchHelper } from "../lib/actions/FetchHelper"

export const justificarRefeicao = async ({ indiceDaJustificativa, meal_id }: { indiceDaJustificativa: IJustificativaDeEstudante["value"], meal_id: number }) => {
    if (!indiceDaJustificativa) return { sucesso: false, mensagem: "Nenhuma justificativa selecionada. Selecione uma justificativa." };

    const justificativa = justificativasPermitidas.find(justificativa => justificativa.value == indiceDaJustificativa);

    if (!justificativa) {
        return { sucesso: false, mensagem: "Justificativa inválida" };
    }

    const auth = cookies().get("authorization")?.value;
    if (!auth) return redirecionarViaAction();

    const resposta = await FetchHelper.put<IRefeicao>({
        rota: `/student/schedulings/student-justification/${meal_id}`,
        cookies: cookies(),
        body: { studentJustification: justificativa.label }
    });

    if (!resposta.sucesso) return { sucesso: false, mensagem: resposta.message };

    return { sucesso: true, mensagem: "Justificativa registrada com sucesso" };
}






// async function handleStudentJustification(){
//     if(justification == 0){
//         loadAlert('error', 'Informe a Justificativa.')
//         return ;
//     }
//     const studentJustification = justificationsList[justification].label;
//     const idScheduling = schedulingsNotUsed.id;
//     console.log('data', idScheduling);

//     const data = {
//         studentJustification
//     }
//     let response= {};
//     try {
//         response = await api.put('student/schedulings/student-justification/'+idScheduling, data);
//         if (response.status === 202) {
//             if(response.data.message){
//                 loadAlert('error', response.data.message);
//             }
//         } else {
//             loadAlert('success', 'Reserva registrada.');
//         }
//     } catch (error) {
//         loadAlert('error', getErrorMessage (error));
//     }
//     setOpenJustification(false);
//     window.location.reload();
// }