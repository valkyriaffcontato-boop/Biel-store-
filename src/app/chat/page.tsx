import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { Gamepad2, Shield, Sparkles, Search, Clock } from "lucide-react";
import Link from "next/link";
import { buyProduct } from "./actions/market";

export default async function HomePage() {
  const session = await getSession();
  const products = await prisma.product.findMany({
    where: { status: "active" }, // Mostra apenas anúncios ativos
    include: { seller: true },
    orderBy: { createdAt: "desc" }
  });

  const categories = [
    { name: "Roblox", color: "from-amber-500 to-orange-600" },
    { name: "Free Fire", color: "from-red-500 to-rose-600" },
    { name: "Valorant", color: "from-cyan-500 to-blue-600" },
    { name: "Genshin", color: "from-teal-500 to-emerald-600" },
    { name: "Mobile Legends", color: "from-indigo-500 to-purple-600" },
    { name: "Gift Cards", color: "from-gray-500 to-zinc-600" }
  ];

  return (
    <div className="min-h-screen bg-[#0a0e17] text-white">
      {/* HERO */}
      <section className="max-w-5xl mx-auto px-4 py-16 text-center space-y-6 relative">
        <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-xs text-emerald-400 font-bold">
          <Shield className="w-3.5 h-3.5" /> Pagamento protegido com escrow de 7 dias
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none">
          Compre e venda itens de <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">jogos</span>
        </h1>
        <p className="text-neutral-400 max-w-lg mx-auto text-xs md:text-sm">
          Contas, skins, diamantes e robux com proteção garantida para compradores e vendedores.
        </p>
        <div className="max-w-xl mx-auto bg-neutral-900/60 border border-neutral-800 rounded-xl p-1.5 flex items-center gap-2">
          <Search className="w-4 h-4 text-neutral-500 ml-3 shrink-0" />
          <input type="text" placeholder="Buscar Roblox, Free Fire..." className="w-full bg-transparent text-xs text-white focus:outline-none" />
          <button className="bg-purple-600 hover:bg-purple-500 text-xs font-bold px-4 py-2.5 rounded-lg">Buscar</button>
        </div>
      </section>

      {/* VITRINE */}
      <section id="vitrine" className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <h2 className="text-lg font-bold flex items-center gap-2"><Gamepad2 className="w-5 h-5 text-emerald-400" /> Anúncios recentes</h2>
        
        {products.length === 0 ? (
          <p className="text-xs text-neutral-500 text-center py-12 border border-dashed border-neutral-800 rounded-xl">Nenhum anúncio ativo à venda no momento.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div key={p.id} className="bg-neutral-900/30 border border-neutral-800 rounded-2xl p-4 flex flex-col justify-between hover:border-emerald-500/30 transition duration-200">
                
                <Link href={`/products/${p.id}`} className="space-y-3 cursor-pointer group block">
                  {/* FOTO DO PRODUTO NO CARD DA VITRINE */}
                  <div className="aspect-video bg-neutral-950 rounded-xl border border-neutral-850 flex items-center justify-center overflow-hidden mb-2">
                    {p.image ? (
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    ) : (
                      <Gamepad2 className="w-8 h-8 text-neutral-800" />
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[9px] uppercase font-bold bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full">
                      {p.category}
                    </span>
                    {p.isBoosted && (
                      <span className="text-[9px] uppercase font-black bg-purple-500/10 text-purple-400 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                        ★ VIP
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-neutral-100 group-hover:text-emerald-400 transition leading-snug line-clamp-1">{p.title}</h3>
                  <p className="text-xs text-neutral-400 line-clamp-2">{p.description}</p>
                </Link>

                <div className="flex justify-between items-center pt-4 border-t border-neutral-800/50 mt-4">
                  <div>
                    <span className="text-[9px] text-neutral-500 uppercase block">Preço</span>
                    <span className="text-base font-black text-emerald-400">R$ {p.price.toFixed(2)}</span>
                  </div>
                  <form action={async () => { "use server"; await buyProduct(p.id); }}>
                    <button className="bg-[#00e676] hover:bg-emerald-400 text-black font-extrabold text-xs px-4 py-2 rounded-xl transition">
                      Comprar
                    </button>
                  </form>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
