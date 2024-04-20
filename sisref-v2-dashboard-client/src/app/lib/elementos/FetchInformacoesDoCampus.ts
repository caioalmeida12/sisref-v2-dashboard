import { IInformacoesDoCampus } from "@/app/elementos/interfaces/IInformacoesDoCampus";
import { cookies } from "next/headers";

export const fetchInformacoesDoCampus = async (id: string) => {
    const API_URL = "https://ruapi.cedro.ifce.edu.br/api/all/campus"

    const cookie = cookies().get("authorization")
    if (!cookie?.value) return null

    const response = await fetch(API_URL, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": cookie.value
        },
    })

    if (!response.ok) return null

    const data: Array<IInformacoesDoCampus> = await response.json()

    const array = Array.isArray(data) ? data : [data]

    const campus = array.find((campus) => campus.id === Number(id))
    if(!campus) return null

    return campus
};
