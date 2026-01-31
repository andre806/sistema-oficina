import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const registrarPagamento = mutation({
    args: {
        oficinaId: v.id("oficinas"),
        servicoId: v.id("servicos"),
        valor: v.number(),
        forma: v.union(
            v.literal("dinheiro"),
            v.literal("pix"),
            v.literal("cartao_credito"),
            v.literal("cartao_debito"),
            v.literal("transferencia")
        ),
        status: v.union(
            v.literal("confirmado"),
            v.literal("pendente"),
            v.literal("estornado")
        ),
        criadoEm: v.number(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("pagamentos", args)
    },
})