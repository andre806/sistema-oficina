import { Id } from "@workspace/backend/_generated/dataModel";
import { MutationCtx } from "@workspace/backend/_generated/server";
import { edit_veiculo_type } from "../types/edit-veiculo-type";
import { response } from "@workspace/backend/types/response";

export async function editar_veiculo_case(
    ctx: MutationCtx,
    veiculoId: Id<"veiculos">,
    campos: edit_veiculo_type,
): Promise<response> {
    try {


        //retira os campos undefinidos
        const updates: any = {}
        for (const [key, value] of Object.entries(campos)) {
            if (value !== undefined) {
                updates[key] = value
            }
        }

        const patch = await ctx.db.patch(veiculoId, updates)
        return {
            sucess: true,
            message: "campos editados",
            content: patch
        }
    } catch (error) {
        return {
            sucess: false,
            message: "erro no try",
            content: error
        }

    }
}

