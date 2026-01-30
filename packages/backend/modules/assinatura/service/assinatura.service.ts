import { MutationCtx } from "@workspace/backend/_generated/server.js";
import { get_assinatura_case } from "../use-cases/get-assinatura.case.js";
import { Id } from "@workspace/backend/_generated/dataModel.js";
import { plano_controller } from "modules/planos/controller/plano.controller.js";
import { errors } from "erros/erros.js";
import { response } from "types/response.js";

export async function assinatura_service(ctx:MutationCtx, oficinaId:Id<"oficinas">){
    const assinatura = await get_assinatura_case(ctx, {oficinaId:oficinaId});
    const premium = await (await plano_controller(ctx)).getPlanoPremiumId()
    const getCountVeiculo = await ctx.db.query("veiculos").withIndex("by_oficina", o=> o.eq("oficinaId", oficinaId)).collect();
    return{
        podeCriarVeiculo:async():Promise<response> =>{
            try {
                
            
            if(assinatura?.planoId == premium && getCountVeiculo.length >= 20 ){
                if (assinatura?.expiresAt as number <  Date.now()) {
                      
                    return{
                        sucess:false,
                        message: "plano expirado",
                        content:errors.PLANO_EXPIRADO
                    }
                }else{
                    return{
                        sucess:true,
                        message:"veiculos ilimitados no plano premium"     
                    }
                }
            }
            else{
                
                if(getCountVeiculo.length >= 20){
                    return{
                        sucess:false,
                        message:"limite atingido",
                        content:errors.LIMITE_VEICULOS_EXCEDIDO
                    }
                }else{
                    return{
                        sucess:true,
                        message:"limite ainda não atingido"
                    }
                }
            }
            } catch (error) {
                return{
                    sucess:false,
                    message:"erro no try",
                    content:error
                }  
            }
        },
        podeCriarOs:async (veiculoId:Id<"veiculos">): Promise<response> =>{
            try {
                const osCount = await ctx.db.query("servicos").withIndex("by_veiculo", s=> s.eq("veiculoId", veiculoId)).collect()
            if(assinatura?.planoId == premium ){
                if (assinatura?.expiresAt as number <  Date.now() && osCount.length > 1 ){
                    return{
                        sucess:false,
                        message: "plano expirado",
                        content:errors.PLANO_EXPIRADO
                    }
                }else{
                    return{
                        sucess:true,
                        message:"serviços ilimitados por veiculo no plano premium"     
                    }
                }
            }
            else{
                if(osCount.length > 1){
                    return{
                        sucess:false,
                        message:"limite atingido",
                        content:errors.LIMITE_SERVICOS_ATINGIDO
                    }
                }else{
                    return{
                        sucess:true,
                        message:"limite ainda não atingido"
                    }
                }
            }
            } catch (error) {
                return{
                    sucess:false,
                    message:"erro no try",
                    content:error
                }  
            }
        },
        is_premium: async ():Promise<boolean> =>{
            if(assinatura?.planoId == premium){
              return true 
            }else{
                return false
            }
        }
    }
}