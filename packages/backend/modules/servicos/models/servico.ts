import { Id } from "@workspace/backend/_generated/dataModel";
import { NUMBER, STRING } from "types/convex-types";

export interface servico {
    oficinaId: Id<"oficinas"> ,
    veiculoId: Id<"veiculos"> ,
    descricao: string,
    valor?: NUMBER,
    status: STRING, // aberto | concluido
}