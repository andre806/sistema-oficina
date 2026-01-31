import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { create_os_case } from "../modules/servicos/use-cases/create-os.case"
import { concluir_os_case } from "../modules/servicos/use-cases/concluir-os.case"
export const createOs = mutation({
    args: {
     

        oficinaId: v.id("oficinas"),
        veiculoId: v.id("veiculos"),
        descricao: v.string(),
         orcamento: v.object({
      maoDeObra: v.number(),
      pecas: v.number(),
      desconto: v.optional(v.number()),
      total: v.number(),
      status: v.union(
        v.literal("rascunho"),
        v.literal("aprovado"),
        v.literal("rejeitado")
      ),
      criadoEm: v.number(),
      aprovadoEm: v.optional(v.number())
    }),
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
export const getStatusFinanceiro = query({
    args:{
        servicoId:v.id("servicos")
    },
    handler:async (ctx, args) => {
        const pagamento = await ctx.db.query("pagamentos").withIndex("by_servico", p => p.eq("servicoId", args.servicoId)).first();
        return pagamento;
    },
})
export const FilterByData = query({
  args: {
    oficinaId: v.id("oficinas"),
    dataInicio: v.number(),
    dataFim: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pagamentos")
      .withIndex("by_oficina", q =>
        q.eq("oficinaId", args.oficinaId)
      )
      .filter(q =>
        q.and(
          q.eq(q.field("status"), "confirmado"),
          q.gte(q.field("criadoEm"), args.dataInicio),
          q.lte(q.field("criadoEm"), args.dataFim)
        )
      )
      .collect();
  },
});

export const FilterByCliente = query({
  args: {
    oficinaId: v.id("oficinas"),
    nomeCliente: v.string(),
  },
  handler: async (ctx, args) => {

    // 1️⃣ buscar veículos desse cliente
    const veiculos = await ctx.db
      .query("veiculos")
      .withIndex("by_oficina", q =>
        q.eq("oficinaId", args.oficinaId)
      )
      .filter(q =>
        q.eq(q.field("clienteNome"), args.nomeCliente)
      )
      .collect();

    if (veiculos.length === 0) return [];

    const veiculoIds = veiculos.map(v => v._id);

    // 2️⃣ buscar serviços desses veículos
    const servicos = await ctx.db
      .query("servicos")
      .withIndex("by_oficina", q =>
        q.eq("oficinaId", args.oficinaId)
      )
      .filter(q =>
        q.or(...veiculoIds.map(id =>
          q.eq(q.field("veiculoId"), id)
        ))
      )
      .collect();

    if (servicos.length === 0) return [];

    const servicoIds = servicos.map(s => s._id);

    // 3️⃣ buscar pagamentos dessas OS
    return await ctx.db
      .query("pagamentos")
      .withIndex("by_oficina", q =>
        q.eq("oficinaId", args.oficinaId)
      )
      .filter(q =>
        q.and(
          q.eq(q.field("status"), "confirmado"),
          q.or(...servicoIds.map(id =>
            q.eq(q.field("servicoId"), id)
          ))
        )
      )
      .collect();
  },
});


export const FilterFormaPagamento = query({
  args: {
    oficinaId: v.id("oficinas"),
    forma: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pagamentos")
      .withIndex("by_oficina", q =>
        q.eq("oficinaId", args.oficinaId)
      )
      .filter(q =>
        q.and(
          q.eq(q.field("status"), "confirmado"),
          q.eq(q.field("forma"), args.forma)
        )
      )
      .collect();
  },
});


export const faturamentoDoDia = query({
  args: {
    oficinaId: v.id("oficinas"),
  },
  handler: async (ctx, args) => {
    const inicioDia = new Date().setHours(0, 0, 0, 0);
    const fimDia = new Date().setHours(23, 59, 59, 999);

    const pagamentos = await ctx.db
      .query("pagamentos")
      .withIndex("by_oficina", q =>
        q.eq("oficinaId", args.oficinaId)
      )
      .filter(q =>
        q.and(
          q.eq(q.field("status"), "confirmado"),
          q.gte(q.field("criadoEm"), inicioDia),
          q.lte(q.field("criadoEm"), fimDia)
        )
      )
      .collect();

    return pagamentos.reduce((total, p) => total + p.valor, 0);
  },
});

export const faturamentodomes = query({
  args: {
    oficinaId: v.id("oficinas"),
  },
  handler: async (ctx, args) => {
    const now = new Date();
    const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const fimMes = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).getTime();

    const pagamentos = await ctx.db
      .query("pagamentos")
      .withIndex("by_oficina", q =>
        q.eq("oficinaId", args.oficinaId)
      )
      .filter(q =>
        q.and(
          q.eq(q.field("status"), "confirmado"),
          q.gte(q.field("criadoEm"), inicioMes),
          q.lte(q.field("criadoEm"), fimMes)
        )
      )
      .collect();

    return pagamentos.reduce((total, p) => total + p.valor, 0);
  },
});

export const ticketmedioporOS = query({
  args: {
    oficinaId: v.id("oficinas"),
  },
  handler: async (ctx, args) => {
    const pagamentos = await ctx.db
      .query("pagamentos")
      .withIndex("by_oficina", q =>
        q.eq("oficinaId", args.oficinaId)
      )
      .filter(q =>
        q.eq(q.field("status"), "confirmado")
      )
      .collect();

    if (pagamentos.length === 0) return 0;

    const total = pagamentos.reduce((sum, p) => sum + p.valor, 0);
    const osUnicas = new Set(pagamentos.map(p => p.servicoId));

    return total / osUnicas.size;
  },
});
export const OSemaberto = query({
  args: {
    oficinaId: v.id("oficinas"),
  },
  handler: async (ctx, args) => {
    const servicos = await ctx.db
      .query("servicos")
      .withIndex("by_oficina", q =>
        q.eq("oficinaId", args.oficinaId)
      )
      .filter(q =>
        q.eq(q.field("status"), "concluido")
      )
      .collect();

    const result = [];

    for (const servico of servicos) {
      const pagamentos = await ctx.db
        .query("pagamentos")
        .withIndex("by_servico", q =>
          q.eq("servicoId", servico._id)
        )
        .filter(q =>
          q.eq(q.field("status"), "confirmado")
        )
        .collect();

      const totalPago = pagamentos.reduce((s, p) => s + p.valor, 0);

      if (totalPago < servico.orcamento.total) {
        result.push({
          servicoId: servico._id,
          saldo: servico.orcamento.total - totalPago,
        });
      }
    }

    return result;
  },
});


