import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Gamepad2, Plus, Trash2, Eye, EyeOff, Sparkles, FolderSync } from "lucide-react";
import Link from "next/link";
import { deleteProduct, toggleProductStatus, boostProduct } from "../../../actions/market";

export default async function SellerListingsPage() {
  const session = await getSession();

  if (!session || (session.role !== "SELLER" && session.role !== "ADMIN")) {
    return (
      <div className="min-h-screen bg-[#08080c] flex items-center justify-center">
        <p className="text-xs text-neutral-500">Acesso negado.</p>
      </div>
    );
  }

  // Buscar todos os anúncios criados por este vendedor
  const myProducts = await prisma.product.findMany({
    where: { sellerId: session.userId },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen bg-[#08080c] text-white py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* CABEÇALHO DO PAINEL */}
        <div className="flex justify-between items-center bg-neutral-900/40 border border-neutral-800 p-5 rounded-2xl">
          <div>
            <h1 className="text-lg font-black text-emerald-400 flex items-center gap-1.5">
              <Gamepad2 className="w-5 h-5" /> Seus Anúncios Publicados
            </h1>
            <p className="text-xs text-neutral-500">Gerencie a visibilidade, impulsione ou apague seus itens</p>
          </div>
          <Link href="/dashboard/seller/create" className="bg-[#00e676] hover:bg-emerald-400 text-black font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1 transition">
            <Plus className="w-4 h-4" /> Novo Anúncio
          </Link>
        </div>

        {/* LISTAGEM DE ANÚNCIOS */}
        {myProducts.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-neutral-800 rounded-3xl bg-neutral-900/10">
            <p className="text-xs text-neutral-500">Você ainda não tem nenhum anúncio criado.</p>
            <Link href="/dashboard/seller/create" className="text-xs text-emerald-400 font-bold mt-2 inline-block hover:underline">Anunciar primeiro item</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {myProducts.map((p) => (
              <div key={p.id} className="bg-neutral-900/20 border border-neutral-800 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-neutral-100">{p.title}</p>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${p.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-neutral-800 text-neutral-500'}`}>
                      {p.status === "active" ? "Ativo" : "Oculto"}
                    </span>
                    {p.isBoosted && (
                      <span className="text-[9px] bg-purple-500/10 border border-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded-full font-bold">
                        ★ VIP
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">Categoria: {p.category} | Preço: <strong className="text-emerald-400">R$ {p.price.toFixed(2)}</strong></p>
                </div>

                {/* BOTÕES DE CONTROLE DO ANÚNCIO */}
                <div className="flex flex-wrap gap-2">
                  
                  {/* VER ANÚNCIO */}
                  <Link href={`/products/${p.id}`} className="bg-neutral-850 hover:bg-neutral-800 text-neutral-300 font-bold px-3 py-2 rounded-xl text-xs transition flex items-center gap-1 border border-neutral-800">
                    <Eye className="w-3.5 h-3.5" /> Ver
                  </Link>

                  {/* IMPULSIONAR ANÚNCIO */}
                  {!p.isBoosted && (
                    <form action={async () => { "use server"; await boostProduct(p.id); }}>
                      <button className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 font-bold px-3 py-2 rounded-xl text-xs transition flex items-center gap-1 border border-purple-500/30">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Impulsionar VIP
                      </button>
                    </form>
                  )}

                  {/* OCULTAR / REATIVAR ANÚNCIO */}
                  <form action={async () => { "use server"; await toggleProductStatus(p.id, p.status); }}>
                    <button className="bg-neutral-850 hover:bg-neutral-800 text-neutral-300 font-bold px-3 py-2 rounded-xl text-xs transition flex items-center gap-1 border border-neutral-800">
                      {p.status === "active" ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" /> Ocultar
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" /> Reativar
                        </>
                      )}
                    </button>
                  </form>

                  {/* DELETAR ANÚNCIO */}
                  <form action={async () => { "use server"; await deleteProduct(p.id); }}>
                    <button className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold px-3 py-2 rounded-xl text-xs transition flex items-center gap-1 border border-rose-500/20">
                      <Trash2 className="w-3.5 h-3.5" /> Excluir
                    </button>
                  </form>

                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center pt-2">
          <Link href="/" className="text-xs text-neutral-500 hover:text-neutral-400 font-bold flex items-center justify-center gap-1">
            <FolderSync className="w-3.5 h-3.5" /> Voltar para a Loja
          </Link>
        </div>

      </div>
    </div>
  );
}
