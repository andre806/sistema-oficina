import { v } from "convex/values";
import { mutation } from "./_generated/server";

import {create_assinatura_case} from "../modules/assinatura/use-cases/create-assinatura.case"




export const createAssinatura = mutation({
    args:{
        oficinaId: v.id("oficinas"),
        planoId: v.id("planos"),
        status: v.string(), 
       
    },
    handler:async(ctx, args) => {
        return await create_assinatura_case(ctx, args);
    },
})

