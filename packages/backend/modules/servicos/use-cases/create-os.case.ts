import { MutationCtx } from "@workspace/backend/_generated/server";
import { servico } from "../models/servico";
import { assinatura_service } from "modules/assinatura/service/assinatura.service";
import { response } from "types/response";
import { veiculo_service } from "modules/veiculos/services/veiculo-service";
export async function create_os_case(ctx:MutationCtx, args:servico):Promise<response> {
    //cada veiculo possui apenas um os no plano gratuito
    const pode_criar_os = await  (await assinatura_service(ctx, args.oficinaId)).podeCriarOs(args.veiculoId);
    const veiculo_ativo = await  (await veiculo_service()).veiculo_esta_ativo(ctx, args.veiculoId)
    if(pode_criar_os.sucess != true && veiculo_ativo.sucess == false){
        return{
            sucess:false,
            content:pode_criar_os
        }
    }else{
        const criarVeiculo = await ctx.db.insert("servicos", args)
        return{
            sucess:true,
            content:criarVeiculo
        }
    }
}