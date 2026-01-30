import { v } from "convex/values";
import { mutation } from "./_generated/server";
import {criarOficinaCase} from "../modules/oficina/use-cases/criar-oficina-case"
import {response} from "../types/response"
export const createOficina = mutation({
    args:{
        nomeFantasia: v.string(),
        telefone: v.optional(v.string()),
        createdAt: v.number(),
    },
    handler:async (ctx, args) =>{
        const criarOficina:response = await criarOficinaCase(ctx, args);
        return criarOficina
    },
})