import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { ShieldCheck, User, Star, BadgeCheck, Wallet, Sparkles, FolderSync, Trash2, Eye, EyeOff, Plus } from "lucide-react";
import Link from "next/link";
import { requestSellerRole, updateProfileImage, deleteProduct, toggleProductStatus, boostProduct } from "../../actions/market";
import ClientImageUploader from "@/components/ClientImageUploader";

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

  const user = await prisma.user.findUnique({ where: { id: session.userId } });

  // Buscar anúncios do vendedor (ignora os que foram marcados como "deleted")
  const myProducts = await prisma.product.findMany({
    where: { 
      sellerId: session.userId,
      NOT: { status: "deleted" }
    },
    orderBy: { createdAt: "desc" }
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

  async function saveAvatar(base64: string) {
    "use server";
    await updateProfileImage(base64);
  }

  return (
    <div className="min-h-screen bg-[#08080c] text-white py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* BANNER DO PERFIL */}
        <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
          <div className="relative w-24 h-24 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center text-neutral-500 overflow-hidden shrink-0">
            {user?.image ? (
              <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-neutral-600" />
            )}
            <ClientImageUploader onUploadComplete={saveAvatar} />
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
          </div>
        </div>

        {/* CARTEIRA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-5 space-y-3">
            <p className="text-xs text-neutral-400 font-bold">SALDO EM CARTEIRA</p>
            <p className="text-2xl font-black text-emerald-400">R$ {user?.balance.toFixed(2)}</p>
            <p className="text-[10px] text-yellow-500 font-bold">Bloqueado em escrow: R$ {user?.frozenBalance.toFixed(2)}</p>
          </div>
          <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-5 space-y-3">
            <p className="text-xs text-neutral-400 font-bold">REPUTAÇÃO DA CONTA</p>
            <div className="flex items-center gap-1 text-sm font-bold mt-2">
              <Star className="w-4 h-4 text-yellow-500 shrink-0" /> 5.0 / 5.0 Excelente
            </div>
          </div>
        </div>

        {/* GERENCIAR ANÚNCIOS DO VENDEDOR (SE FOR SELLER OU ADMIN) */}
        {(user?.role === "SELLER" || user?.role === "ADMIN") && (
          <div className="bg-[#0b0c14] border border-neutral-800/80 p-6 rounded-3xl space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-black text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Seus Anúncios Publicados
              </h2>
              <Link href="/dashboard/seller/create" className="bg-[#00e676] hover:bg-emerald-400 text-black font-extrabold text-[10px] px-3.5 py-2 rounded-xl flex items-center gap-1 transition">
                <Plus className="w-3.5 h-3.5" /> Novo Anúncio
              </Link>
            </div>

            {myProducts.length === 0 ? (
              <p className="text-xs text-neutral-500 py-4">Você ainda não tem anúncios ativos.</p>
            ) : (
              <div className="divide-y divide-neutral-800/45">
                {myProducts.map((p) => (
                  <div key={p.id} className="py-3 flex justify-between items-center gap-4 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-neutral-200">{p.title}</p>
                        <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full ${p.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-neutral-800 text-neutral-500'}`}>
                          {p.status === "active" ? "Ativo" : "Oculto"}
                        </span>
                        {p.isBoosted && <span className="text-[8px] bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded-full font-bold">★ VIP</span>}
                      </div>
                      <p className="text-[10px] text-neutral-500 mt-0.5">Preço: <strong className="text-emerald-400">R$ {p.price.toFixed(2)}</strong></p>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/products/${p.id}`} className="bg-neutral-900 border border-neutral-800 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1">
                        <Eye className="w-3 h-3" /> Ver
                      </Link>

                      {!p.isBoosted && (
                        <form action={async () => { "use server"; await boostProduct(p.id); }}>
                          <button className="bg-purple-600/10 border border-purple-500/20 text-purple-400 px-2 py-1 rounded text-[10px] font-bold">★ VIP</button>
                        </form>
                      )}

                      <form action={async () => { "use server"; await toggleProductStatus(p.id, p.status); }}>
                        <button className="bg-neutral-900 border border-neutral-800 px-2 py-1 rounded text-[10px] font-bold">
                          {p.status === "active" ? "Pausar" : "Ativar"}
                        </button>
                      </form>

                      <form action={async () => { "use server"; await deleteProduct(p.id); }}>
                        <button className="bg-rose-500/10 text-rose-400 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1">
                          <Trash2 className="w-3 h-3" /> Excluir
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* FORMULÁRIO DE SELLER */}
        {user?.role === "USER" && (
          <div className="bg-[#0b0c14] border border-neutral-800/80 p-6 rounded-3xl space-y-4">
            <h2 className="text-base font-bold text-emerald-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Solicitar Cargo de Vendedor
            </h2>
            <form action={handleRequestSeller} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input name="fullName" placeholder="Nome Completo" className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-xs" required />
              <input name="cpf" placeholder="CPF" className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-xs" required />
              <input name="whatsapp" placeholder="WhatsApp" className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-xs" required />
              <input name="games" placeholder="Jogos" className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-xs" required />
              <textarea name="experience" placeholder="Sua experiência..." className="sm:col-span-2 bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-xs h-16" required />
              <button className="sm:col-span-2 bg-[#00e676] hover:bg-emerald-400 text-black font-extrabold py-3 rounded-xl text-xs transition">Enviar Solicitação</button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
