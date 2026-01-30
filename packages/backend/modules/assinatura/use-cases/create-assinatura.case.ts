import { Id } from "@workspace/backend/_generated/dataModel.js";
import { MutationCtx } from "@workspace/backend/_generated/server.js";
import { assinatura_status } from "types/Assinatura.status.js";

export async function create_assinatura_case(ctx:MutationCtx, args:{
        oficinaId:Id<"oficinas">,
        planoId: Id<"planos">,
}){
    const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;
        const startedAt = Date.now();
        const expiresAt = startedAt + THIRTY_DAYS;
        return await ctx.db.insert("assinaturas", {... args,startedAt:startedAt, expiresAt:expiresAt, status:String(assinatura_status.ATIVA) })  
}