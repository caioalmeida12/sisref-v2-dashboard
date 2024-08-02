"use server"

import { cookies } from "next/headers"
import { redirecionarViaAction } from "../lib/actions/RedirecionarViaAction"
import { mensagemDeErroPorCodigoHTTP } from "../lib/actions/MensagemDeErroPorCodigoHTTP"
import { IJustificativaDeEstudante, justificativasPermitidas } from "../elementos/interfaces/IJustificativaDeEstudante"

export const justificarRefeicao = async ({ indiceDaJustificativa, meal_id }: { indiceDaJustificativa: IJustificativaDeEstudante["value"], meal_id: number }) => {
    console.log('meal_id', meal_id);
    const API_URL = new URL(`https://ruapi.cedro.ifce.edu.br/api/student/schedulings/student-justification/${meal_id}`);

    if (!indiceDaJustificativa) return { sucesso: false, mensagem: "Nenhuma justificativa selecionada. Selecione uma justificativa." };

    const justificativa = justificativasPermitidas.find(justificativa => justificativa.value == indiceDaJustificativa);

    if (!justificativa) {
        return { sucesso: false, mensagem: "Justificativa inválida" };
    }

    const auth = cookies().get("authorization")?.value;
    if (!auth) return redirecionarViaAction();

    const resposta = await fetch(`${API_URL}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "Authorization": auth
        },
        body: JSON.stringify({
            studentJustification: justificativa.label
        })
    });

    if (!resposta.ok) {
        const mensagemErro = mensagemDeErroPorCodigoHTTP(resposta.status);
        return { sucesso: false, mensagem: mensagemErro };
    }

    const json = await resposta.json();

    console.log('json', json);

    if (typeof json.message != "undefined") return { sucesso: false, mensagem: json.message };

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