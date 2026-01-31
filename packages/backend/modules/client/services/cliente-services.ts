import { Id } from "@workspace/backend/_generated/dataModel";
import { MutationCtx } from "@workspace/backend/_generated/server";
import { response } from "@workspace/backend/types/response";

export async function client_service() {
    return {
    async create(ctx: MutationCtx, args: {
      oficinaId: any;
      nome: string;
      telefone?: string;
    }) {
      return await ctx.db.insert("cliente", args);
    },

    async exists(ctx: MutationCtx, nomeCliente: string) {
      const client = await ctx.db
        .query("cliente")
        .withIndex("by_nome", q =>
          q.eq("nome", nomeCliente)
        )
        .first();

      return client;
    }}
}