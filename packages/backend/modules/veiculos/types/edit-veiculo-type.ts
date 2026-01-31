import { BOOLEAN, NUMBER, STRING } from "../../../types/convex-types"

export interface edit_veiculo_type {
    placa?: STRING
    modelo?: STRING
    ano?: NUMBER
    clienteNome?: STRING
    clienteTelefone?: STRING
    ativo?: BOOLEAN
}