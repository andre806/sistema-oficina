import { Id } from "@workspace/backend/_generated/dataModel";
import {  STRING } from "types/convex-types";
import { orcamento } from "./orcamento";

export interface servico {
    oficinaId: Id<"oficinas"> ,
    veiculoId: Id<"veiculos"> ,
    descricao: string,
    orcamento: orcamento,
    status: STRING, // aberto | concluido
}