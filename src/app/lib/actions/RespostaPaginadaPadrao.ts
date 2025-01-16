import { IRespostaPaginada } from "../../interfaces/IRespostaPaginada"
export const respostaPaginadaPadrao = {
    current_page: 1,
    data: [] as any[],
    first_page_url: "",
    from: null,
    last_page: 1,
    last_page_url: "",
    links: [],
    next_page_url: null,
    path: "",
    per_page: 10,
    prev_page_url: "",
    to: 10,
    total: 10
} satisfies IRespostaPaginada<any>