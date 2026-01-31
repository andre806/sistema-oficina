import { Id } from "@workspace/backend/_generated/dataModel";
import { MutationCtx } from "@workspace/backend/_generated/server";
import { response } from "types/response";

export async function veiculo_service(){
    return{
        veiculo_esta_ativo:async(ctx:MutationCtx, veiculoId:Id<"veiculos">):Promise<response> =>{
            const veiculo =  await ctx.db.query("veiculos").withIndex("by_id", v=> v.eq("_id", veiculoId)).first()
            return{
                sucess: !!veiculo?.ativo
            }
        }
    }
}