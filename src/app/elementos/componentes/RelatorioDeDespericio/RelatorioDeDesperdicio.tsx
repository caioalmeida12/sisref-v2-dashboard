import React from "react";

import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import Card from "./Card";
import { Modal } from "./Modal";
import { fetchRelatorioDeDesperdicio } from "@/app/actions/fetchRelatorioDeDesperdicio";

const CardWrapper = async ({ data }: { data: string }) => {
    const relatorio = await fetchRelatorioDeDesperdicio({ data })

    if (!relatorio || 'message' in relatorio) return <p>{relatorio?.message || "Relatório não encontrado para data"}</p>

    return (
        <Card data={data}>
            <div
                dangerouslySetInnerHTML={{
                    __html: DOMPurify(new JSDOM("<!DOCTYPE html>").window).sanitize(
                        relatorio.content
                    ),
                }}
            />
        </Card>
    )
}

const ModalWrapper = async ({ data }: { data: string }) => {
    const relatorio = await fetchRelatorioDeDesperdicio({ data })

    if (!relatorio || 'message' in relatorio) return null

    return (
        <Modal titulo="Relatório de desperdício">
            <div
                dangerouslySetInnerHTML={{
                    __html: DOMPurify(new JSDOM("<!DOCTYPE html>").window).sanitize(
                        relatorio.content
                    ),
                }}
            />
        </Modal>
    )
}

export const RelatorioDeDesperdicio = ({ data, variante }: { data: string, variante: "card" | "modal" }) => {
    return variante === "card" ? <CardWrapper data={data} /> : <ModalWrapper data={data} />
}