import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const definirOrcamento = mutation({
    args:{
           servicoId:v.id("servicos"),
           orcamento:v.object({
           maoDeObra: v.number(),
              pecas: v.number(),
              desconto: v.optional(v.number()),
              total: v.number(),
              status: v.union(
                v.literal("rascunho"),
                v.literal("aprovado"),
                v.literal("rejeitado")
              ),
              criadoEm: v.number(),
              aprovadoEm: v.optional(v.number())
            })
    },
    handler:async(ctx, args) =>{
        const servico = await ctx.db.query("servicos").withIndex("by_id", s => s.eq("_id", args.servicoId)).first();
        if(servico?.orcamento){
            return await ctx.db.patch(servico._id, args.orcamento);
        }else{
            return
        }
    }
})