import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { ShieldAlert, Users, List, Sparkles, Check, Trash2, Mail, CheckCircle } from "lucide-react";
import Link from "next/link";
import { approveSeller, moderateProduct, resolveSupportTicket } from "../../actions/market";

export default async function AdminDashboardPage() {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-[#08080c] flex items-center justify-center">
        <p className="text-xs text-neutral-500">Acesso negado.</p>
      </div>
    );
  }

  const usersCount = await prisma.user.count();
  const products = await prisma.product.findMany({ include: { seller: true } });
  const pendingSellers = await prisma.sellerRequest.findMany({
    where: { status: "PENDING" },
    include: { user: true }
  });
  
  // Buscar chamados abertos (Usando o desvio de tipo 'as any' para contornar o cache de compilação)
  const tickets = await (prisma as any).supportTicket.findMany({
    where: { status: "OPEN" },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen bg-[#08080c] text-white py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="space-y-1">
          <h1 className="text-xl font-black text-amber-400 flex items-center gap-1.5">
            <ShieldAlert className="w-5 h-5" /> Painel Administrativo Geral
          </h1>
          <p className="text-xs text-neutral-500">Administradores Proprietários</p>
        </div>

        {/* METRICAS */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-neutral-900/40 border border-neutral-800 p-4 rounded-2xl">
            <p className="text-xs text-neutral-400">Usuários Ativos</p>
            <p className="text-lg font-bold">{usersCount}</p>
          </div>
          <div className="bg-neutral-900/40 border border-neutral-800 p-4 rounded-2xl">
            <p className="text-xs text-neutral-400">Anúncios Criados</p>
            <p className="text-lg font-bold">{products.length}</p>
          </div>
          <div className="bg-neutral-900/40 border border-neutral-800 p-4 rounded-2xl">
            <p className="text-xs text-neutral-400">Vendedores Pendentes</p>
            <p className="text-lg font-bold text-yellow-500">{pendingSellers.length}</p>
          </div>
          <div className="bg-neutral-900/40 border border-neutral-800 p-4 rounded-2xl">
            <p className="text-xs text-neutral-400">Chamados de Ajuda</p>
            <p className="text-lg font-bold text-emerald-400">{tickets.length}</p>
          </div>
        </div>

        {/* SOLICITAÇÕES DE VENDEDOR */}
        <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-emerald-400">Aprovações de Vendedores</h2>
          {pendingSellers.length === 0 ? (
            <p className="text-xs text-neutral-500">Nenhuma solicitação pendente.</p>
          ) : (
            <div className="divide-y divide-neutral-800/40">
              {pendingSellers.map((req) => (
                <div key={req.id} className="py-3 flex justify-between items-center gap-4 text-xs">
                  <div>
                    <p className="font-bold">{req.fullName} ({req.user.email})</p>
                    <p className="text-[10px] text-neutral-500">Exp: {req.experience}</p>
                  </div>
                  <form action={async () => { "use server"; await approveSeller(req.id); }}>
                    <button className="bg-emerald-600 hover:bg-emerald-500 font-bold px-3 py-1.5 rounded-lg">Aprovar</button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CHAMADOS DE SUPORTE DOS CLIENTES */}
        <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
            <Mail className="w-4 h-4" /> Chamados e Denúncias de Suporte
          </h2>
          {tickets.length === 0 ? (
            <p className="text-xs text-neutral-500">Nenhum chamado de ajuda pendente.</p>
          ) : (
            <div className="divide-y divide-neutral-800/40">
              {tickets.map((t: any) => (
                <div key={t.id} className="py-4 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-neutral-200">{t.name} ({t.email})</p>
                    <form action={async () => { "use server"; await resolveSupportTicket(t.id); }}>
                      <button className="bg-emerald-600 hover:bg-emerald-500 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Resolver Chamado
                      </button>
                    </form>
                  </div>
                  <p className="bg-neutral-950 p-3 rounded-xl border border-neutral-850 text-neutral-400 leading-relaxed italic">
                    "{t.message}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MODERAR PRODUTOS */}
        <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-purple-400">Moderação de Anúncios</h2>
          {products.map((p) => (
            <div key={p.id} className="py-3 flex justify-between items-center gap-4 text-xs">
              <div>
                <p className="font-bold">{p.title}</p>
                <p className="text-[10px] text-neutral-500">Vendedor: @{p.seller.name} | Status: <span className="font-bold uppercase text-yellow-500">{p.status}</span></p>
              </div>
              <div className="flex gap-2">
                <form action={async () => { "use server"; await moderateProduct(p.id, "active"); }}>
                  <button className="bg-emerald-600 px-3 py-1 rounded text-[10px] font-bold">Ativar</button>
                </form>
                <form action={async () => { "use server"; await moderateProduct(p.id, "rejected"); }}>
                  <button className="bg-rose-600 px-3 py-1 rounded text-[10px] font-bold">Banir</button>
                </form>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
