import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { ShieldCheck, User, Star, BadgeCheck, Wallet, Sparkles, FolderSync } from "lucide-react";
import Link from "next/link";
import { requestSellerRole } from "../../actions/market";

export default async function ProfilePage() {
  const session = await getSession();
  
  if (!session) {
    return (
      <div className="min-h-screen bg-[#08080c] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <p className="text-sm text-neutral-400">Você precisa estar logado para ver o perfil.</p>
          <Link href="/login" className="inline-block bg-[#00e676] text-black px-4 py-2 rounded-xl text-xs font-bold">Fazer Login</Link>
        </div>
      </div>
    );
  }

  // Buscar usuário completo do banco
  const user = await prisma.user.findUnique({
    where: { id: session.userId }
  });

  async function handleRequestSeller(formData: FormData) {
    "use server";
    await requestSellerRole({
      fullName: formData.get("fullName") as string,
      cpf: formData.get("cpf") as string,
      whatsapp: formData.get("whatsapp") as string,
      games: formData.get("games") as string,
      experience: formData.get("experience") as string,
    });
  }

  return (
    <div className="min-h-screen bg-[#08080c] text-white py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* BANNER DO PERFIL */}
        <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-emerald-500/5 blur-[50px] rounded-full pointer-events-none" />

          {/* AVATAR COM ÍCONE DE CÂMERA */}
          <div className="relative w-24 h-24 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center text-neutral-500 overflow-hidden">
            <User className="w-10 h-10 text-neutral-600" />
            <div className="absolute bottom-0 inset-x-0 bg-black/60 py-1 text-center text-[9px] font-bold text-neutral-400 cursor-pointer">
              EDITAR
            </div>
          </div>

          <div className="text-center md:text-left space-y-2 flex-1">
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-2">
              <h1 className="text-xl font-black">{user?.name}</h1>
              {user?.isVerified && (
                <span className="inline-flex items-center gap-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full text-[9px] font-bold">
                  <BadgeCheck className="w-3 h-3" /> Verificado
                </span>
              )}
              {user?.role === "SELLER" && (
                <span className="inline-flex items-center gap-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full text-[9px] font-bold">
                  Vendedor
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500">@{user?.email.split("@")[0]}</p>
            <p className="text-[10px] text-neutral-600">Membro desde 2026</p>
          </div>
        </div>

        {/* METRICAS DE REPUTAÇÃO */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-neutral-900/20 p-4 rounded-2xl border border-neutral-900/60 text-center">
            <Star className="w-4 h-4 text-yellow-500 mx-auto mb-1" />
            <p className="text-xs text-neutral-400">Reputação</p>
            <p className="text-sm font-bold mt-0.5">5.0 / 5</p>
          </div>
          <div className="bg-neutral-900/20 p-4 rounded-2xl border border-neutral-900/60 text-center">
            <p className="text-xs text-neutral-400">Vendas</p>
            <p className="text-sm font-bold mt-2">0</p>
          </div>
          <div className="bg-neutral-900/20 p-4 rounded-2xl border border-neutral-900/60 text-center">
            <p className="text-xs text-neutral-400">Compras</p>
            <p className="text-sm font-bold mt-2">--</p>
          </div>
          <div className="bg-neutral-900/20 p-4 rounded-2xl border border-neutral-900/60 text-center">
            <p className="text-xs text-neutral-400">Saldo Congelado</p>
            <p className="text-sm font-bold mt-2 text-yellow-500">R$ {user?.frozenBalance.toFixed(2)}</p>
          </div>
        </div>

        {/* CARTEIRA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs text-neutral-400 font-bold">
              <Wallet className="w-4 h-4 text-emerald-400" /> CARTEIRA
            </div>
            <div>
              <p className="text-2xl font-black text-emerald-400">R$ {user?.balance.toFixed(2)}</p>
              <p className="text-[10px] text-neutral-500 mt-1">Saldo disponível para saque</p>
            </div>
          </div>

          <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs text-neutral-400 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> SELO DE VERIFICAÇÃO
            </div>
            <div>
              <p className="text-xs text-neutral-200 font-bold">{user?.isVerified ? "Você é verificado" : "Selo pendente"}</p>
              <p className="text-[10px] text-neutral-500 mt-1">O selo oficial aparece em todos os seus anúncios.</p>
            </div>
          </div>
        </div>

        {/* FORMULÁRIO QUERO VENDER (SE FOR USUÁRIO COMUM) */}
        {user?.role === "USER" && (
          <div className="bg-[#0b0c14] border border-neutral-800/80 p-6 rounded-3xl space-y-4">
            <h2 className="text-base font-bold text-emerald-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Solicitar Cargo de Vendedor
            </h2>
            <form action={handleRequestSeller} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input name="fullName" placeholder="Nome Completo" className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-xs" required />
              <input name="cpf" placeholder="CPF" className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-xs" required />
              <input name="whatsapp" placeholder="WhatsApp" className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-xs" required />
              <input name="games" placeholder="Jogos (ex: Roblox, Free Fire)" className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-xs" required />
              <textarea name="experience" placeholder="Escreva sobre sua experiência vendendo itens..." className="sm:col-span-2 bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-xs h-16" required />
              <button className="sm:col-span-2 bg-[#00e676] hover:bg-emerald-400 text-black font-extrabold py-3 rounded-xl text-xs transition">
                Enviar Solicitação
              </button>
            </form>
          </div>
        )}

        <div className="text-center">
          <Link href="/" className="text-xs text-neutral-500 hover:text-neutral-400 font-bold flex items-center justify-center gap-1">
            <FolderSync className="w-3.5 h-3.5" /> Voltar para a Loja
          </Link>
        </div>

      </div>
    </div>
  );
}
