import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    clerkId: v.string(),
    role: v.optional(v.string()),
    sector: v.optional(v.string()),
    status: v.optional(v.string()),
    approvedBy: v.optional(v.id("users")),
    approvedAt: v.optional(v.number()),
    rejectedBy: v.optional(v.id("users")),
    rejectedAt: v.optional(v.number()),
    rejectionReason: v.optional(v.string()),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_role", ["role"])
    .index("by_status", ["status"]),
  oficinas: defineTable({
    nomeFantasia: v.string(),
    telefone: v.optional(v.string()),

    status: v.string(), // ativa | bloqueada

    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_nomeFantasia", ["nomeFantasia"]),

  planos: defineTable({
    nome: v.union(
      v.literal("gratuito"),
      v.literal("premium")
    ),

    limiteVeiculos: v.optional(v.number()), // undefined = ilimitado
    precoMensal: v.number(),

    ativo: v.boolean(),

    createdAt: v.number(),
  })
    .index("by_nome", ["nome"])
    .index("by_ativo", ["ativo"]),
  assinaturas: defineTable({
    oficinaId: v.id("oficinas"),
    planoId: v.id("planos"),

    status: v.string(), // ativa | atrasada | cancelada

    startedAt: v.number(),
    expiresAt: v.number(),
  })
    .index("by_oficina", ["oficinaId"])
    .index("by_plano", ["planoId"])
    .index("by_status", ["status"]),
  veiculos: defineTable({
    oficinaId: v.id("oficinas"),
    placa: v.string(),
    modelo: v.optional(v.string()),
    ano: v.optional(v.number()),
    clienteNome: v.optional(v.string()),
    clienteTelefone: v.optional(v.string()),
    ativo: v.boolean(),
    clientId: v.optional(v.string())
  })
    .index("by_oficina", ["oficinaId"])
    .index("by_placa_oficina", ["placa", "oficinaId"])
    .index("by_cliente_nome", ["clienteNome"]),
  servicos: defineTable({
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
    status: v.any(),
    dataConclusao: v.optional(v.number())
  })
    .index("by_oficina", ["oficinaId"])
    .index("by_veiculo", ["veiculoId"])
    .index("by_status", ["status"]),
   

  cliente: defineTable({
    oficinaId: v.id("oficinas"),
    nome: v.string(),
    telefone: v.optional(v.string()),
  })
    .index("by_oficina", ["oficinaId"])
    .index("by_nome", ["nome"])
    .index("by_telefone", ["telefone"]),
    pagamentos: defineTable({
  oficinaId: v.id("oficinas"),
  servicoId: v.id("servicos"),

  valor: v.number(),

  forma: v.union(
    v.literal("dinheiro"),
    v.literal("pix"),
    v.literal("cartao_credito"),
    v.literal("cartao_debito"),
    v.literal("transferencia")
  ),

  status: v.union(
    v.literal("confirmado"),
    v.literal("pendente"),
    v.literal("estornado")
  ),

  criadoEm: v.number(),
})
.index("by_servico", ["servicoId"])
.index("by_oficina",["oficinaId"])
});