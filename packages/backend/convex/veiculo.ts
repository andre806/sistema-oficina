import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { cadastro_veiculo_case } from "../modules/veiculos/use-cases/cadastro-veiculo.case"
import {editar_veiculo_case} from "../modules/veiculos/use-cases/editar-veiculo.case"
import { response } from "../types/response";
import { Id } from "./_generated/dataModel";
export const criarVeiculo = mutation({
    args: {
    oficinaId: v.id("oficinas"),
    placa: v.string(),
    modelo:v.optional(v.string()),
    ano: v.number(),
    clienteNome: v.string(),
    clienteTelefone: v.string(),
    ativo: v.boolean()
    },
    handler: async (ctx, args) => {
        return await cadastro_veiculo_case(ctx, args)
    },
})
export const editarVeiculo = mutation({
    args:{
    veiculoId:v.id("veiculos"),
    updates: v.object({
    placa: v.string(),
    modelo: v.optional(v.string()),
    ano: v.optional(v.number()),
    clienteNome: v.optional(v.string()),
    clienteTelefone: v.optional(v.string()),
    ativo: v.boolean(),
    })
    },
    handler:async(ctx, args)  =>{
        const patch:response= await editar_veiculo_case(ctx, args.veiculoId , args.updates);
        return patch
    },
})

export const getVeiculosByPlaca = query({
    args:{
        oficinaId:v.id("oficinas"),
        placa:v.string()
    },
    handler:async (ctx, args) => {
        return await ctx.db.query("veiculos").withIndex("by_placa_oficina", v=> v.eq("placa", args.placa).eq("oficinaId", args.oficinaId)).collect()
    },
})
export const getVeiculosByClient = query({
     args:{
        clienteNome: v.optional(v.string()),
    },
    handler:async (ctx, args) => {
        return await ctx.db.query("veiculos").withIndex("by_cliente_nome", v=> v.eq("clienteNome", args.clienteNome)).collect();
    },
})