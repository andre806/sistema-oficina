import { Id } from "@workspace/backend/_generated/dataModel.js";
import { MutationCtx } from "@workspace/backend/_generated/server.js";
import { getAuthenticatedUser } from "@workspace/backend/lib/auth.js";

export async function get_assinatura_case(ctx:MutationCtx,args:{oficinaId:Id<"oficinas">} ) {
    const assinatura = await ctx.db.query("assinaturas").withIndex("by_oficina", o => o.eq("oficinaId", args.oficinaId)).first()
    return assinatura

}