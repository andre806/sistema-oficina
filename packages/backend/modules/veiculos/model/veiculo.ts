import { Id } from "@workspace/backend/_generated/dataModel.js"

export interface veiculos {
    oficinaId: Id<"oficinas">
    placa: string
    modelo?: string
    ano?: number
    clienteNome?: string,
    clienteTelefone?: string
    ativo: boolean
}