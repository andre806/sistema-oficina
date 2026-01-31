import { MutationCtx } from "@workspace/backend/_generated/server";
import { types_planos } from "types/typesPlano";

export async function plano_controller(ctx:MutationCtx) {
    return{
        getPlanoPremiumId:async() =>{
            const plano =  await ctx.db.query("planos").withIndex("by_nome", p => p.eq("nome", types_planos.PREMIUM)).first()
           return plano?._id
        },
         getPlanoFreeId:async() =>{
           const plano =  await ctx.db.query("planos").withIndex("by_nome", p => p.eq("nome", types_planos.FREE)).first()
           return plano?._id
        }
    }
}