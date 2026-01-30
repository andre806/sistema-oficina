import { v } from "convex/values";
import { mutation, query } from "./_generated/server.js";
import { create_os_case } from "../modules/servicos/use-cases/create-os.case.js"
import { concluir_os_case } from "../modules/servicos/use-cases/concluir-os.case.js"
export const createOs = mutation({
    args: {
        oficinaId: v.id("oficinas"),
        veiculoId: v.id("veiculos"),
        descricao: v.string(),
        valor: v.optional(v.number()),
        status: v.string(),
        createdAt: v.number(),
    },
    handler: async (ctx, args) => {
        return await create_os_case(ctx, args)
    },
})
export const concluirOsCase = mutation({
    args: {
        servicoId: v.id("servicos")
    },
    handler: async (ctx, args) => {
        return await concluir_os_case(ctx, args.servicoId)
    },
})
export const listByVeiculo = query({
    args:{
        veiculoId:v.id("veiculos")
    },
    handler: async (ctx, args) =>{
        return await ctx.db.query("servicos").withIndex("by_veiculo", s=> s.eq("veiculoId", args.veiculoId)).collect()
    },
})
export const listByClient= query({
     args:{
        clientNome:v.string()
    },
    handler: async (ctx, args) =>{
        const veiculoByClient = await  ctx.db.query("veiculos").withIndex("by_cliente_nome", s=> s.eq("clienteNome", args.clientNome)).collect();
        const servicos:any = []
        veiculoByClient.map((v) =>{
            const servicoByVeiculoId = ctx.db.query("servicos").withIndex("by_veiculo", s=> s.eq("veiculoId", v._id)).collect()
            servicos.push(servicoByVeiculoId)
        })
        return servicos;

    },
})

export const listByStatus = query({
    args:{
        status:v.any()
    },
    handler: async (ctx, args) =>{
        return await  ctx.db.query("servicos").withIndex("by_status", s=> s.eq("status", args.status)).collect()
    },
})
