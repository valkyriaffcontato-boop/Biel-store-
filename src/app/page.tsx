import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { Gamepad2, Shield, Zap, Headphones, ArrowRight, ShieldCheck, CheckCircle, HelpCircle } from "lucide-react";
import Link from "next/link";
import { buyProduct } from "./actions/market";

export default async function HomePage() {
  const session = await getSession();
  const products = await prisma.product.findMany({
    include: { seller: true },
    orderBy: { createdAt: "desc" },
    take: 6
  });

  const categories = [
    { name: "Roblox", items: "Robux & Contas" },
    { name: "Free Fire", items: "Contas & Dimas" },
    { name: "Valorant", items: "Skins & VP" },
    { name: "Genshin Impact", items: "Gemas" },
    { name: "Mobile Legends", items: "Diamonds" },
    { name: "Gift Cards", items: "Xbox & PSN" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0e17] text-white">
      {/* HERO SECTION */}
      <section className="max-w-5xl mx-auto px-4 py-16 text-center space-y-6 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 rounded-full text-xs text-emerald-400 font-bold">
          <Shield className="w-3.5 h-3.5" /> Pagamento protegido com escrow de 7 dias
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
          Compre e venda itens de <br />
          <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            jogos
          </span> com segurança
        </h1>

        <p className="text-neutral-400 max-w-xl mx-auto text-xs md:text-sm leading-relaxed">
          Contas, skins, diamantes, robux e gift cards de Free Fire, Roblox, Valorant, Mobile Legends e Genshin Impact. Tudo em um só lugar, com proteção total ao comprador e ao vendedor.
        </p>

        <div className="flex justify-center gap-3 pt-2">
          <Link href="#vitrine" className="bg-[#00e676] hover:bg-emerald-400 text-black font-extrabold px-6 py-3 rounded-xl text-xs transition active:scale-95 flex items-center gap-1.5">
            <Gamepad2 className="w-4 h-4" /> Explorar anúncios
          </Link>
          <Link href="/dashboard/profile" className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 font-bold px-6 py-3 rounded-xl text-xs transition">
            Quero vender
          </Link>
        </div>

        {/* TRUST BADGES */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-10 text-left">
          <div className="flex items-center gap-3 bg-neutral-900/40 p-4 rounded-xl border border-neutral-800/50">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-xs font-bold">Pagamento protegido</p>
              <p className="text-[10px] text-neutral-500">Saldo retido por segurança</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-neutral-900/40 p-4 rounded-xl border border-neutral-800/50">
            <Zap className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-xs font-bold">Saques rápidos</p>
              <p className="text-[10px] text-neutral-500">Dinheiro na conta sem burocracia</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-neutral-900/40 p-4 rounded-xl border border-neutral-800/50">
            <Headphones className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-xs font-bold">Suporte 24/7</p>
              <p className="text-[10px] text-neutral-500">Estamos aqui para ajudar</p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="max-w-5xl mx-auto px-4 py-8 space-y-4">
        <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-wider">Navegue por jogo</h2>
        <p className="text-xs text-neutral-500 -mt-2">Encontre os melhores itens do seu jogo favorito</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat, i) => (
            <div key={i} className="bg-neutral-900/40 border border-neutral-800/50 rounded-2xl p-4 hover:border-neutral-700 transition cursor-pointer">
              <p className="font-extrabold text-sm">{cat.name}</p>
              <p className="text-[10px] text-neutral-500 mt-0.5">{cat.items}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VITRINE DE PRODUTOS */}
      <section id="vitrine" className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">Anúncios recentes</h2>
            <p className="text-xs text-neutral-500">Novidades adicionadas pela comunidade</p>
          </div>
          <Link href="#vitrine" className="text-xs text-emerald-400 font-bold hover:underline flex items-center gap-1">
            Ver todos <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {products.length === 0 ? (
          <p className="text-xs text-neutral-500 text-center py-12 border border-dashed border-neutral-800 rounded-xl">
            Nenhum produto anunciado ainda. Faça login e anuncie para começar!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div key={p.id} className="bg-neutral-900/30 border border-neutral-800 rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-500/30 transition duration-200">
                <div className="space-y-2">
                  <span className="text-[9px] uppercase font-bold bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    {p.category}
                  </span>
                  <h3 className="font-bold text-sm text-neutral-100 line-clamp-1">{p.title}</h3>
                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">{p.description}</p>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-neutral-800/50 mt-4">
                  <div>
                    <span className="text-[9px] text-neutral-500 block uppercase">Preço</span>
                    <span className="text-base font-black text-emerald-400">R$ {p.price.toFixed(2)}</span>
                  </div>
                  <form action={async () => { "use server"; await buyProduct(p.id); }}>
                    <button className="bg-[#00e676] hover:bg-emerald-400 text-black font-extrabold text-xs px-4 py-2 rounded-xl transition duration-200 active:scale-95 shadow-md">
                      Comprar
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* COMO FUNCIONA A PROTEÇÃO */}
      <section className="max-w-5xl mx-auto px-4 py-12 border-t border-neutral-900">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-xl font-bold">Como funciona a proteção</h2>
          <p className="text-xs text-neutral-400">Sistema de escrow estilo GG Max: o dinheiro fica protegido até você confirmar.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-900/20 p-6 rounded-2xl border border-neutral-900 space-y-3">
            <span className="text-lg font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg">01</span>
            <h3 className="font-bold text-sm text-neutral-200">Você compra</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">O pagamento fica retido em garantia por 7 dias após a compra.</p>
          </div>
          <div className="bg-neutral-900/20 p-6 rounded-2xl border border-neutral-900 space-y-3">
            <span className="text-lg font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg">02</span>
            <h3 className="font-bold text-sm text-neutral-200">Receba e confirme</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">Após receber o item, confirme "tudo ocorreu bem" para liberar o pagamento.</p>
          </div>
          <div className="bg-neutral-900/20 p-6 rounded-2xl border border-neutral-900 space-y-3">
            <span className="text-lg font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg">03</span>
            <h3 className="font-bold text-sm text-neutral-200">Liberação ou apelação</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">Sem contestação, valor liberado ao vendedor. Com contestação, o admin analisa as provas.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
