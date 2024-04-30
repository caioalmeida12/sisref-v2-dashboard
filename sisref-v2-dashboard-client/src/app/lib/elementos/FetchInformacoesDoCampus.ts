import { IInformacoesDoCampus } from "@/app/elementos/interfaces/IInformacoesDoCampus";
import { cookies } from "next/headers";
import { redirecionarViaAction } from "../actions/RedirecionarViaAction";

export const fetchInformacoesDoCampus = async (id: string) => {
    const API_URL = "https://ruapi.cedro.ifce.edu.br/api/all/campus"

    const auth = cookies().get("authorization")?.value
    if (!auth) return redirecionarViaAction()

    const response = await fetch(API_URL, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": auth
        },
    })

    if (!response.ok) return redirecionarViaAction()

    const data: Array<IInformacoesDoCampus> = await response.json()

    const array = Array.isArray(data) ? data : [data]

    const campus = array.find((campus) => campus.id === Number(id))
    if(!campus) return redirecionarViaAction()

    return campus
};
