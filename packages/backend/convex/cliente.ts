import { v } from "convex/values";
import { query } from "./_generated/server";
import { Id } from "./_generated/dataModel";


export const totalVeiculos= query({
    args:{
        nome:v.string()
    },
    handler:async (ctx, args) =>{
        return await ctx.db.query("veiculos").withIndex("by_cliente_nome", v => v.eq("clienteNome",args.nome)).collect()
    },
})
export const totalOs= query({
    args:{
        nome:v.string()
    },
    handler:async (ctx, args) =>{
        const veiculos =  await ctx.db.query("veiculos").withIndex("by_cliente_nome", v => v.eq("clienteNome",args.nome)).collect();
        const servicos:any[] = []
        for(const veiculo of veiculos){
            const os =  await ctx.db.query("servicos").withIndex("by_veiculo", v => v.eq("veiculoId",veiculo._id)).collect()
             servicos.push(...os)
        }
        return servicos
    },
})
export const primeiroAtendimento= query({
    args:{
        nome:v.string()
    },
    handler:async (ctx, args) =>{
        const v = await ctx.db.query("veiculos").withIndex("by_cliente_nome", v => v.eq("clienteNome",args.nome)).order("asc").first()
        return await ctx.db.query("servicos").withIndex("by_veiculo", a => a.eq("veiculoId",v?._id as Id<"veiculos"> )).order("asc").first()
    },
})
export const ultimoAtendimento= query({
    args:{
        nome:v.string()
    },
    handler:async (ctx, args) =>{
        const v = await ctx.db.query("veiculos").withIndex("by_cliente_nome", v => v.eq("clienteNome",args.nome)).order("desc").first()
        return await ctx.db.query("servicos").withIndex("by_veiculo", a => a.eq("veiculoId",v?._id as Id<"veiculos"> )).order("desc").first()
    },
})
export const getByNome= query({
    args:{
        nome:v.string()
    },
    handler:async (ctx, args) =>{
        return await ctx.db.query("cliente").withIndex("by_nome", c => c.eq("nome", args.nome)).first()
    },
})
export const getByPlacaVeiculo= query({
    args:{
        placa:v.string()
    },
    handler:async (ctx, args) =>{
        const veiculo = await ctx.db.query("veiculos").withIndex("by_placa_oficina", v => v.eq("placa", args.placa)).first();
        return await ctx.db.query("cliente").withIndex("by_oficina", c => c.eq("oficinaId", veiculo?.oficinaId as Id<"oficinas">)).first();
    },
})
export const OrderByUltimoAtendimento = query({
  args: {
    oficinaId: v.id("oficinas")
  },
  handler: async (ctx, args) => {
    const servicos = await ctx.db
      .query("servicos")
      .withIndex("by_oficina", s => s.eq("oficinaId", args.oficinaId))
      .order("desc")
      .collect();

    const seen = new Set<string>();
    const clientes = [];

    for (const s of servicos) {
      const veiculo = await ctx.db.get(s.veiculoId);
      if (!veiculo?.clienteNome) continue;

      if (seen.has(veiculo.clienteNome)) continue;

      const cliente = await ctx.db
        .query("cliente")
        .withIndex("by_nome", c => c.eq("nome", veiculo.clienteNome as string))
        .first();

      if (cliente) {
        seen.add(veiculo.clienteNome);
        clientes.push(cliente);
      }
    }

    return clientes;
  }
});

export const OrderByQuantidadeDeVeiculos = query({
  args: {
    oficinaId: v.id("oficinas")
  },
  handler: async (ctx, args) => {
    const veiculos = await ctx.db
      .query("veiculos")
      .withIndex("by_oficina", v => v.eq("oficinaId", args.oficinaId))
      .collect();

    const countMap = new Map<string, number>();

    for (const v of veiculos) {
      if (!v.clienteNome) continue;
      countMap.set(v.clienteNome, (countMap.get(v.clienteNome) ?? 0) + 1);
    }

    const clientes = await ctx.db
      .query("cliente")
      .withIndex("by_oficina", c => c.eq("oficinaId", args.oficinaId))
      .collect();

    return clientes.sort(
      (a, b) =>
        (countMap.get(b.nome) ?? 0) -
        (countMap.get(a.nome) ?? 0)
    );
  }
});
export const OrderByValorTotalMovimentado = query({
  args: {
    oficinaId: v.id("oficinas")
  },
  handler: async (ctx, args) => {
    const servicos = await ctx.db
      .query("servicos")
      .withIndex("by_oficina", s => s.eq("oficinaId", args.oficinaId))
      .collect();

    const totalMap = new Map<string, number>();

    for (const s of servicos) {
      if (!s.orcamento.total) continue;

      const veiculo = await ctx.db.get(s.veiculoId);
      if (!veiculo?.clienteNome) continue;

      totalMap.set(
        veiculo.clienteNome,
        (totalMap.get(veiculo.clienteNome) ?? 0) + s.orcamento.total
      );
    }

    const clientes = await ctx.db
      .query("cliente")
      .withIndex("by_oficina", c => c.eq("oficinaId", args.oficinaId))
      .collect();

    return clientes.sort(
      (a, b) =>
        (totalMap.get(b.nome) ?? 0) -
        (totalMap.get(a.nome) ?? 0)
    );
  }
});
