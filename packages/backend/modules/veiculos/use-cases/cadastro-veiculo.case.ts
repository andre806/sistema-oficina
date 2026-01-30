import { MutationCtx } from "@workspace/backend/_generated/server.js";
import { veiculos } from "../model/veiculo.js";
import { response } from "types/response.js";
import { errors } from "erros/erros.js";
import { assinatura_service } from "modules/assinatura/service/assinatura.service.js";

export async function cadastro_veiculo_case(ctx:MutationCtx, args:veiculos):Promise<response>{
    //rn11 placa obrigatoria e unica por oficina
    const VerificaPlacaExiste = await ctx.db.query("veiculos").withIndex("by_placa_oficina", v => v.eq("placa",args.placa).eq("oficinaId", args.oficinaId)).first();
    if(VerificaPlacaExiste){
        return {
            sucess:false,
            message:"placa existe",
            content:errors.PLACA_ALREDY_EXISTS
        }
    }else{
        const podeCriar = await (await assinatura_service(ctx, args.oficinaId)).podeCriarVeiculo();
        if(podeCriar.sucess == true){
            const createVeiculo = await ctx.db.insert("veiculos", args);
            return{
                sucess:true,
                message:"veiculo criado com sucesso",
                content:createVeiculo
            }
        }else{
            return{
                sucess:false,
                message:"veiculo não pode ser criado",
                content:podeCriar.content
            }
        }
    }

}