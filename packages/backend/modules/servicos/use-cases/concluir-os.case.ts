import { Id } from "@workspace/backend/_generated/dataModel.js";
import { MutationCtx } from "@workspace/backend/_generated/server.js";;
import { response } from "types/response.js";
import { status_servico } from "../types/status-servico.js"
export async function concluir_os_case(ctx: MutationCtx, servicoId: Id<"servicos">): Promise<response> {

    const status: status_servico = "concluido"
    const patchActive = await ctx.db.patch(servicoId, {
        status: status,
        dataConclusao:Date.now()
    })
    return {
        sucess: true,
        content: patchActive
    }



}