import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { ShieldAlert, Users, List, Sparkles, Check, Trash2 } from "lucide-react";
import Link from "next/link";
import { approveSeller, moderateProduct } from "../../actions/market";

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

  return (
    <div className="min-h-screen bg-[#08080c] text-white py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="space-y-1">
          <h1 className="text-xl font-black text-amber-400 flex items-center gap-1.5">
            <ShieldAlert className="w-5 h-5" /> Painel administrativo completo
          </h1>
          <p className="text-xs text-neutral-500">BIEL STORE - Administradores Proprietários</p>
        </div>

        {/* METRICAS */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-neutral-900/40 border border-neutral-800 p-4 rounded-2xl">
            <p className="text-xs text-neutral-500">Usuários Ativos</p>
            <p className="text-xl font-bold mt-1">{usersCount}</p>
          </div>
          <div className="bg-neutral-900/40 border border-neutral-800 p-4 rounded-2xl">
            <p className="text-xs text-neutral-500">Anúncios Criados</p>
            <p className="text-xl font-bold mt-1">{products.length}</p>
          </div>
          <div className="bg-neutral-900/40 border border-neutral-800 p-4 rounded-2xl">
            <p className="text-xs text-neutral-500">Vendedores Pendentes</p>
            <p className="text-xl font-bold mt-1 text-yellow-500">{pendingSellers.length}</p>
          </div>
        </div>

        {/* APROVAR VENDEDORES */}
        <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-emerald-400">Solicitações de Vendedores</h2>
          {pendingSellers.length === 0 ? (
            <p className="text-xs text-neutral-500">Nenhum vendedor para aprovar.</p>
          ) : (
            <div className="divide-y divide-neutral-800/40">
              {pendingSellers.map((req) => (
                <div key={req.id} className="py-3 flex justify-between items-center gap-4 text-xs">
                  <div>
                    <p className="font-bold">{req.fullName} ({req.user.email})</p>
                    <p className="text-[10px] text-neutral-400">Exp: {req.experience}</p>
                  </div>
                  <form action={async () => { "use server"; await approveSeller(req.id); }}>
                    <button className="bg-emerald-600 hover:bg-emerald-500 font-bold px-3 py-1.5 rounded-lg">Aprovar</button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MODERAR ANÚNCIOS (Aprovar / Banir produtos) */}
        <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-purple-400">Moderação de Anúncios</h2>
          {products.length === 0 ? (
            <p className="text-xs text-neutral-500">Nenhum anúncio criado.</p>
          ) : (
            <div className="divide-y divide-neutral-800/40">
              {products.map((p) => (
                <div key={p.id} className="py-3 flex justify-between items-center gap-4 text-xs">
                  <div>
                    <p className="font-bold">{p.title} - <span className="text-emerald-400">R$ {p.price}</span></p>
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
          )}
        </div>

      </div>
    </div>
  );
}
