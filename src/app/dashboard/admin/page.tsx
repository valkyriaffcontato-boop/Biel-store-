import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { FolderSync, ShieldAlert, Users, List, Sparkles, Check } from "lucide-react";
import Link from "next/link";
import { approveSeller } from "../../actions/market";

export default async function AdminDashboardPage() {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-[#08080c] flex items-center justify-center">
        <p className="text-xs text-neutral-500">Acesso restrito para administradores.</p>
      </div>
    );
  }

  // Estatísticas para os cards
  const usersCount = await prisma.user.count();
  const productsCount = await prisma.product.count();
  const pendingSellers = await prisma.sellerRequest.findMany({
    where: { status: "PENDING" },
    include: { user: true }
  });

  return (
    <div className="min-h-screen bg-[#08080c] text-white py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="space-y-1">
          <h1 className="text-xl font-black text-amber-400 flex items-center gap-1.5">
            <ShieldAlert className="w-5 h-5" /> Painel administrativo
          </h1>
          <p className="text-xs text-neutral-500">Gerencie a plataforma BIEL STORE</p>
        </div>

        {/* CARDS METRICAS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-neutral-900/40 border border-neutral-800/80 p-4 rounded-2xl flex items-center gap-3">
            <Users className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-xs text-neutral-400">Usuários</p>
              <p className="text-sm font-bold">{usersCount}</p>
            </div>
          </div>
          <div className="bg-neutral-900/40 border border-neutral-800/80 p-4 rounded-2xl flex items-center gap-3">
            <List className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-xs text-neutral-400">Anúncios</p>
              <p className="text-sm font-bold">{productsCount}</p>
            </div>
          </div>
          <div className="bg-neutral-900/40 border border-neutral-800/80 p-4 rounded-2xl flex items-center gap-3">
            <p className="text-xs font-bold text-neutral-400">Vendedores pendentes</p>
            <p className="text-sm font-bold">{pendingSellers.length}</p>
          </div>
        </div>

        {/* APROVAÇÃO DE VENDEDORES */}
        <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-3xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Vendedores pendentes de aprovação
          </h2>
          
          {pendingSellers.length === 0 ? (
            <p className="text-xs text-neutral-500">Nenhuma solicitação pendente no momento.</p>
          ) : (
            <div className="divide-y divide-neutral-800/40">
              {pendingSellers.map((req) => (
                <div key={req.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <p className="font-bold text-sm text-neutral-100">{req.fullName}</p>
                    <p className="text-xs text-neutral-400">Jogos: {req.games} | CPF: {req.cpf}</p>
                    <p className="text-[10px] text-neutral-500 italic">" {req.experience} "</p>
                  </div>
                  <form action={async () => { "use server"; await approveSeller(req.id); }}>
                    <button className="bg-emerald-600 hover:bg-emerald-500 text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 active:scale-95">
                      <Check className="w-3.5 h-3.5" /> Aprovar Vendedor
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-center pt-2">
          <Link href="/" className="text-xs text-neutral-500 hover:text-neutral-400 font-bold flex items-center justify-center gap-1">
            <FolderSync className="w-3.5 h-3.5" /> Voltar para a Loja
          </Link>
        </div>

      </div>
    </div>
  );
}
