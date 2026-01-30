import { Id } from "@workspace/backend/_generated/dataModel.js";
import { NUMBER, STRING } from "types/convex-types.js";

export interface servico {
    oficinaId: Id<"oficinas"> ,
    veiculoId: Id<"veiculos"> ,
    descricao: string,
    valor?: NUMBER,
    status: STRING, // aberto | concluido
}