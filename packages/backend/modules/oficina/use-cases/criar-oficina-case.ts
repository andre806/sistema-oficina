import { MutationCtx } from "@workspace/backend/_generated/server";
import { response } from "types/response";
import { errors } from "../../../erros/erros";
import { oficina } from "../model/oficina";
import { create_assinatura_case } from "modules/assinatura/use-cases/create-assinatura.case";
import { Id } from "@workspace/backend/_generated/dataModel";
import { plano_controller } from "modules/planos/controller/plano.controller";

export async function criarOficinaCase(ctx:MutationCtx, args:oficina) {
     let res:response = {
            sucess:false,
            message:"nome já existe",
            content:errors.NAME_ALREDY_EXISTS
        }
    //verificar se o nome já existe
    const nomeExiste = await ctx.db.query("oficinas").withIndex("by_nomeFantasia", o => o.eq("nomeFantasia", args.nomeFantasia)).first()
    if(nomeExiste){
        return res
    }else{
       
       const oficina =  await ctx.db.insert("oficinas", {...args, status:"active"})
       const OFICINA = await ctx.db.query("oficinas").withIndex("by_nomeFantasia", o => o.eq("nomeFantasia", args.nomeFantasia)).first()
       const planoId =  await  (await plano_controller(ctx)).getPlanoFreeId();
       const createAssinatura = await  create_assinatura_case(ctx, {oficinaId:OFICINA?._id as Id<"oficinas"> , planoId:planoId as Id<"planos">})
       res.sucess == true, res.content = {oficina:oficina, assinatura:createAssinatura}, res.message == "usuario cadastrado e plano criado"
       return res
    }
    
}