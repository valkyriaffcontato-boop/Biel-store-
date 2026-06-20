import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { Gamepad2, ShieldCheck, Sparkles, Search, TrendingUp, HelpCircle, PlusCircle, Clock, FolderSync } from "lucide-react";
import { authenticateMock, requestSellerRole, approveSeller, createProduct, buyProduct, confirmReceived } from "./actions/market";

export default async function HomePage() {
  const session = await getSession();
  const products = await prisma.product.findMany({ include: { seller: true }, orderBy: { createdAt: "desc" } });
  const sellerRequests = session?.role === "ADMIN" ? await prisma.sellerRequest.findMany({ where: { status: "PENDING" }, include: { user: true } }) : [];
  const myOrders = session ? await prisma.order.findMany({ where: { buyerId: session.userId }, include: { product: true } }) : [];

  const categories = [
    { name: "Roblox", color: "from-amber-500 to-orange-600" },
    { name: "Free Fire", color: "from-red-500 to-rose-600" },
    { name: "Valorant", color: "from-cyan-500 to-blue-600" },
    { name: "Genshin", color: "from-teal-500 to-emerald-600" },
    { name: "Mobile Legends", color: "from-indigo-500 to-purple-600" },
    { name: "Gift Cards", color: "from-gray-500 to-zinc-600" }
  ];

  async function handleAuth(formData: FormData) {
    "use server";
    await authenticateMock(formData.get("email") as string, formData.get("name") as string, formData.get("action") as "login" | "register");
  }

  async function handleRequestSeller(formData: FormData) {
    "use server";
    await requestSellerRole({
      fullName: formData.get("fullName") as string, cpf: formData.get("cpf") as string,
      whatsapp: formData.get("whatsapp") as string, games: formData.get("games") as string,
      experience: formData.get("experience") as string
    });
  }

  async function handleAddProduct(formData: FormData) {
    "use server";
    await createProduct(formData.get("title") as string, formData.get("description") as string, parseFloat(formData.get("price") as string), formData.get("category") as string);
  }

  return (
    <div className="min-h-screen bg-[#08080c] text-white">
      {/* HERO BANNER */}
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-purple-950/20 via-[#08080c] to-[#08080c] py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <span className="inline-flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full text-xs text-purple-400 font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Intermediação Segura Garantida
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            BIEL <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">STORE</span>
          </h1>
          <p className="text-neutral-400 max-w-lg mx-auto text-xs md:text-sm">
            Compre ou venda contas, skins e itens de jogos com segurança absoluta. Saldo retido por 7 dias para sua proteção.
          </p>
          <div className="max-w-xl mx-auto bg-neutral-900/60 border border-neutral-800 rounded-xl p-1.5 flex items-center gap-2">
            <Search className="w-4 h-4 text-neutral-500 ml-3 shrink-0" />
            <input type="text" placeholder="Buscar Roblox, Free Fire..." className="w-full bg-transparent text-xs text-white focus:outline-none" />
            <button className="bg-purple-600 hover:bg-purple-500 text-xs font-bold px-4 py-2.5 rounded-lg">Buscar</button>
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="max-w-5xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat, i) => (
            <div key={i} className="bg-neutral-900/30 border border-neutral-800/80 rounded-xl p-3 flex items-center gap-2">
              <div className={`w-6 h-6 rounded bg-gradient-to-r ${cat.color} shrink-0`} />
              <span className="text-xs font-bold text-neutral-300">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CATALOGO */}
      <section className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <h2 className="text-lg font-bold flex items-center gap-2"><Gamepad2 className="w-5 h-5 text-purple-500" /> Itens à Venda</h2>
        {products.length === 0 ? (
          <p className="text-xs text-neutral-500 text-center py-12 border border-dashed border-neutral-800 rounded-xl">Nenhum produto anunciado. Abra o painel de testes abaixo para criar um!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div key={p.id} className="bg-neutral-900/30 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between hover:border-purple-900/30 transition">
                <div className="space-y-2">
                  <span className="text-[9px] uppercase font-bold bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full">{p.category}</span>
                  <h3 className="font-bold text-sm text-neutral-200 line-clamp-1">{p.title}</h3>
                  <p className="text-xs text-neutral-400 line-clamp-2">{p.description}</p>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-neutral-800/50 mt-4">
                  <span className="text-base font-black text-emerald-400">R$ {p.price.toFixed(2)}</span>
                  <form action={async () => { "use server"; await buyProduct(p.id); }}>
                    <button className="bg-purple-600 hover:bg-purple-500 text-xs font-bold px-3 py-1.5 rounded-lg active:scale-95 transition">Comprar</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* INTERMEDIAÇÕES (MINHAS COMPRAS) */}
      {session && myOrders.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 py-6">
          <div className="bg-neutral-900/30 border border-neutral-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-purple-400 flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> Minhas Compras</h2>
            <div className="divide-y divide-neutral-800/40">
              {myOrders.map((order) => (
                <div key={order.id} className="py-3 first:pt-0 last:pb-0 flex justify-between items-center gap-2">
                  <div>
                    <p className="font-bold text-xs text-neutral-200">{order.product.title}</p>
                    <p className="text-[10px] text-neutral-500">Valor: <span className="text-emerald-400">R$ {order.amount.toFixed(2)}</span> | Status: <span className="text-yellow-500">{order.status}</span></p>
                  </div>
                  {order.status === "PAID" && (
                    <form action={async () => { "use server"; await confirmReceived(order.id); }}>
                      <button className="bg-emerald-600 hover:bg-emerald-500 text-[10px] font-bold px-3 py-1.5 rounded-lg">Confirmar Recebimento</button>
                    </form>
                  )}
                  {order.status === "COMPLETED" && (
                    <span className="text-[9px] text-neutral-400 flex items-center gap-1 bg-neutral-950 px-2 py-1 rounded-md"><Clock className="w-3 h-3 text-emerald-400" /> Retido (7 dias)</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PAINEL DE CONTROLE / TESTES */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <details className="bg-neutral-900/10 border border-neutral-800/80 rounded-xl overflow-hidden">
          <summary className="cursor-pointer p-4 select-none font-bold text-xs text-purple-400 hover:bg-neutral-900/20 flex justify-between">
            <span className="flex items-center gap-1.5"><FolderSync className="w-4 h-4" /> Painel do Desenvolvedor (Criar Anúncios / Contas de Teste)</span>
            <span>▼</span>
          </summary>
          <div className="p-4 border-t border-neutral-800/60 bg-neutral-950/50 space-y-6">
            
            {/* Alternar Perfil */}
            <div className="space-y-2 bg-neutral-900/30 p-3 rounded-lg border border-neutral-800/40">
              <h3 className="text-xs font-bold text-neutral-300">Alternar de Perfil</h3>
              <form action={handleAuth} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input name="name" placeholder="Nome" defaultValue="Jogador Biel" className="bg-neutral-950 p-2 rounded border border-neutral-800 text-xs" required />
                <input name="email" type="email" placeholder="E-mail" defaultValue="cliente@teste.com" className="bg-neutral-950 p-2 rounded border border-neutral-800 text-xs" required />
                <div className="flex gap-1.5">
                  <button name="action" value="register" className="flex-1 bg-purple-600 hover:bg-purple-500 py-2 rounded text-xs font-bold">Registrar</button>
                  <button name="action" value="login" className="flex-1 bg-neutral-800 py-2 rounded text-xs font-bold">Entrar</button>
                </div>
              </form>
              <p className="text-[10px] text-neutral-500">Dica: Use `calvoeditofc@gmail.com` ou `mafiosodashopping@gmail.com` para se tornar administrador.</p>
            </div>

            {/* Criar Anúncio (Vendedores e Admins) */}
            {session && (session.role === "SELLER" || session.role === "ADMIN") && (
              <div className="space-y-3 bg-neutral-900/30 p-3 rounded-lg border border-neutral-800/40">
                <h3 className="text-xs font-bold text-emerald-400">Criar Anúncio de Venda</h3>
                <form action={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input name="title" placeholder="Título do Anúncio" className="bg-neutral-950 p-2 rounded border border-neutral-800 text-xs" required />
                  <input name="category" placeholder="Categoria (ex: Roblox)" className="bg-neutral-950 p-2 rounded border border-neutral-800 text-xs" required />
                  <input name="price" type="number" step="0.01" placeholder="Preço (R$)" className="bg-neutral-950 p-2 rounded border border-neutral-800 text-xs" required />
                  <textarea name="description" placeholder="Descrição rápida..." className="sm:col-span-3 bg-neutral-950 p-2 rounded border border-neutral-800 text-xs h-12" required />
                  <button className="sm:col-span-3 bg-emerald-600 hover:bg-emerald-500 py-2 rounded text-xs font-bold">Criar Anúncio</button>
                </form>
              </div>
            )}

            {/* Solicitar Vendedor */}
            {session && session.role === "USER" && (
              <div className="space-y-3 bg-neutral-900/30 p-3 rounded-lg border border-neutral-800/40">
                <h3 className="text-xs font-bold text-purple-400">Solicitar Cargo de Vendedor</h3>
                <form action={handleRequestSeller} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input name="fullName" placeholder="Nome Completo" className="bg-neutral-950 p-2 rounded border border-neutral-800 text-xs" required />
                  <input name="cpf" placeholder="CPF" className="bg-neutral-950 p-2 rounded border border-neutral-800 text-xs" required />
                  <input name="whatsapp" placeholder="WhatsApp" className="bg-neutral-950 p-2 rounded border border-neutral-800 text-xs" required />
                  <input name="games" placeholder="Jogos" className="bg-neutral-950 p-2 rounded border border-neutral-800 text-xs" required />
                  <textarea name="experience" placeholder="Sua experiência" className="sm:col-span-2 bg-neutral-950 p-2 rounded border border-neutral-800 text-xs h-12" required />
                  <button className="sm:col-span-2 bg-indigo-600 hover:bg-indigo-500 py-2 rounded text-xs font-bold">Enviar Solicitação</button>
                </form>
              </div>
            )}

            {/* Administrar solicitações de vendedores */}
            {session && session.role === "ADMIN" && sellerRequests.length > 0 && (
              <div className="space-y-2 bg-neutral-900/30 p-3 rounded-lg border border-neutral-800/40">
                <h3 className="text-xs font-bold text-amber-400">Gerenciar Vendedores Pendentes</h3>
                {sellerRequests.map((req) => (
                  <div key={req.id} className="bg-neutral-950 p-3 rounded border border-neutral-800 flex justify-between items-center gap-2 text-xs">
                    <div>
                      <p className="font-bold">{req.fullName} ({req.user.email})</p>
                      <p className="text-[10px] text-neutral-500">Exp: {req.experience}</p>
                    </div>
                    <form action={async () => { "use server"; await approveSeller(req.id); }}>
                      <button className="bg-emerald-600 hover:bg-emerald-500 px-2 py-1 rounded text-[10px] font-bold">Aprovar</button>
                    </form>
                  </div>
                ))}
              </div>
            )}

          </div>
        </details>
      </section>
    </div>
  );
              }
