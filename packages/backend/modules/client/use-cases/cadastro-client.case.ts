import { Id } from "@workspace/backend/_generated/dataModel";
import { client_service } from "../services/cliente-services";
import { MutationCtx } from "@workspace/backend/_generated/server";
import { response } from "@workspace/backend/types/response";

export async function cadastro_client_case(ctx: MutationCtx, nome: string, oficinaId:Id<"oficinas">, telefone?:string): Promise<response | undefined>  {
    try {

        const clientService = await client_service()
        //verificar se já foi cadastrado, caso já tenha sido apenas fazer o patch
        const client = await (await client_service()).exists(ctx, nome) 
        if (!client) {
           const cadastro =  await clientService.create(ctx, {oficinaId, nome, telefone});
            return{
                sucess:true,
                content:cadastro
            }
        }else{
            return
        }
    } catch (error) {
        return{
            sucess:false,
            content:error
        }
    }
}