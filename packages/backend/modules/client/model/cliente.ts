import { Id } from "@workspace/backend/_generated/dataModel";

export interface cliente {
    oficinaId: Id<"oficinas">,
    nome: string,
    telefone?: string,
    totalVeiculos: number
    totalOS: number
    primeiroAtendimento: number
    ultimoAtendimento: number
}