import { NUMBER } from "@workspace/backend/types/convex-types"
type statusOrcamento = "rascunho" | "aprovado" | "rejeitado";
export interface orcamento {
    maoDeObra: number,
    pecas: number,
    desconto?: NUMBER,
    total: number,
    status: statusOrcamento 
    criadoEm: number 
    aprovadoEm?: NUMBER
}