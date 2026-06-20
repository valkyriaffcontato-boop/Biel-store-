import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { 
  Gamepad2, 
  ShieldCheck, 
  Sparkles, 
  Search, 
  TrendingUp, 
  UserCheck, 
  HelpCircle, 
  PlusCircle, 
  Clock, 
  AlertCircle,
  FolderSync
} from "lucide-react";
import { 
  authenticateMock, 
  requestSellerRole, 
  approveSeller, 
  createProduct, 
  buyProduct, 
  confirmReceived 
} from "./actions/market";

export default async function HomePage() {
  const session = await getSession();

  // Buscar dados reais do banco
  const products = await prisma.product.findMany({
    include: { seller: true },
    orderBy: { createdAt: "desc" }
  });

  const sellerRequests = session?.role === "ADMIN" 
    ? await prisma.sellerRequest.findMany({ where: { status: "PENDING" }, include: { user: true } })
    : [];

  const myOrders = session 
    ? await prisma.order.findMany({ where: { buyerId: session.userId }, include: { product: true } })
    : [];

  // Categorias estilizadas
  const categories = [
    { name: "Roblox", items: "Robux & Contas", color: "from-amber-500 to-orange-600" },
    { name: "Free Fire", items: "Contas & Diamantes", color: "from-red-500 to-rose-600" },
    { name: "Valorant", items: "Skins & VP", color: "from-cyan-500 to-blue-600" },
    { name: "Genshin Impact", items: "Contas & Gemas", color: "from-teal-500 to-emerald-600" },
    { name: "Mobile Legends", items: "Diamonds", color: "from-indigo-500 to-purple-600" },
    { name: "Gift Cards", items: "Xbox, PSN & Steam", color: "from-gray-500 to-zinc-600" },
  ];

  // Actions de formulários
  async function handleAuth(formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const action = formData.get("action") as "login" | "register";
    await authenticateMock(email, name, action);
  }

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

  async function handleAddProduct(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const category = formData.get("category") as string;
    await createProduct(title, description, price, category);
  }

  return (
    <div className="min-h-screen bg-[#08080c] text-white selection:bg-purple-600 selection:text-white">
      
      {/* HERO SECTION - BANNER DE IMPACTO */}
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-purple-950/30 via-[#08080c] to-[#08080c] py-16 md:py-24 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-full text-xs font-semibold text-purple-400">
            <Sparkles className="w-3.5 h-3.5" /> Intermediação 100% Segura e Garantida
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Seu Marketplace de <br className="hidden md:inline"/>
            <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Jogos Favoritos
            </span>
          </h1>
          
          <p className="text-neutral-400 max-w-xl mx-auto text-sm md:text-base">
            Compre ou venda contas, skins, gemas e itens com proteção total de saldo por 7 dias. O vendedor só recebe após você confirmar o funcionamento.
          </p>

          {/* BARRA DE BUSCA VITRINE */}
          <div className="max-w-2xl mx-auto bg-neutral-900/50 border border-neutral-800/80 rounded-2xl p-2 flex items-center gap-2 shadow-xl backdrop-blur-md">
            <div className="flex-1 flex items-center gap-2 px-3">
              <Search className="w-5 h-5 text-neutral-500" />
              <input 
                type="text" 
                placeholder="Buscar contas do Roblox, dimas do Free Fire..." 
                className="w-full bg-transparent border-none text-sm text-white focus:outline-none placeholder-neutral-500"
              />
            </div>
            <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-sm font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-purple-600/20 active:scale-95">
              Buscar
            </button>
          </div>
        </div>
      </section>

      {/* CATEGORIAS RÁPIDAS */}
      <section className="max-w-6xl mx-auto px-4 pb-8">
        <h2 className="text-xs font-bold text-neutral-500 tracking-wider uppercase mb-4 flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5" /> Navegar por Categoria
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat, i) => (
            <div key={i} className="group cursor-pointer bg-neutral-900/40 border border-neutral-800/60 rounded-2xl p-4 transition hover:bg-neutral-900/80 hover:border-neutral-700/60 shadow-md">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${cat.color} flex items-center justify-center font-bold text-sm text-white mb-3 shadow-md`}>
                {cat.name[0]}
              </div>
              <h3 className="font-bold text-sm text-neutral-200 group-hover:text-purple-400 transition">{cat.name}</h3>
              <p className="text-xs text-neutral-500 mt-0.5">{cat.items}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONTEÚDO PRINCIPAL: CATÁLOGO */}
      <section className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold flex items-center gap-2">
              <Gamepad2 className="w-6 h-6 text-purple-500" /> Recém Anunciados
            </h2>
            <p className="text-xs text-neutral-500">Produtos atualizados em tempo real com garantia de entrega</p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-neutral-800 rounded-3xl bg-neutral-900/10">
            <Gamepad2 className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
            <p className="text-sm text-neutral-500">Nenhum produto anunciado no momento.</p>
            <p className="text-xs text-neutral-600 mt-1">Crie ou faça login em uma conta de vendedor para publicar o primeiro!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div key={p.id} className="relative group bg-neutral-900/30 border border-neutral-800/80 hover:border-purple-900/40 rounded-2xl overflow-hidden transition duration-300 hover:shadow-xl hover:shadow-purple-900/5 flex flex-col justify-between">
                
                {/* Cabeçalho do Card */}
                <div className="p-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-black bg-purple-500/10 border border-purple-500/20 text-purple-400 px-2.5 py-1 rounded-full">
                      {p.category}
                    </span>
                    <span className="text-[10px] text-neutral-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Hoje
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-neutral-100 group-hover:text-purple-400 transition leading-snug line-clamp-1">
                    {p.title}
                  </h3>
                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                {/* Rodapé do Card */}
                <div className="p-5 pt-0 bg-gradient-to-t from-neutral-950/60 to-transparent border-t border-neutral-800/40 mt-auto flex justify-between items-center gap-4">
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Apenas</p>
                    <p className="text-xl font-black text-emerald-400">R$ {p.price.toFixed(2)}</p>
                  </div>

                  <form action={async () => { "use server"; await buyProduct(p.id); }}>
                    <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-bold px-4 py-2.5 rounded-xl transition duration-200 active:scale-95 shadow-md">
                      Comprar Agora
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SESSÃO: MINHAS COMPRAS (SE ESTIVER AUTENTICADO) */}
      {session && myOrders.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-3xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-purple-400 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-purple-400" /> Suas Compras e Intermediações
            </h2>
            <p className="text-xs text-neutral-400 -mt-2">Acompanhe a entrega dos dados de acesso pelo vendedor e libere o pagamento.</p>

            <div className="divide-y divide-neutral-800/60">
              {myOrders.map((order) => (
                <div key={order.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <p className="font-extrabold text-sm text-neutral-100">{order.product.title}</p>
                    <div className="flex flex-wrap gap-2 items-center text-xs text-neutral-500">
                      <span>Valor: <strong className="text-emerald-400">R$ {order.amount.toFixed(2)}</strong></span>
                      <span>•</span>
                      <span>Pedido: <code className="text-purple-400">{order.id.slice(0, 8)}</code></span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded-full font-bold text-[10px]">
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {order.status === "PAID" && (
                    <form action={async () => { "use server"; await confirmReceived(order.id); }}>
                      <button className="bg-emerald-600 hover:bg-emerald-500 text-xs font-bold px-4 py-2 rounded-xl transition active:scale-95">
                        Marcar como Recebido e Confirmar
                      </button>
                    </form>
                  )}

                  {order.status === "COMPLETED" && (
                    <span className="text-[10px] text-neutral-400 flex items-center gap-1 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-xl font-bold">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" /> Saldo Retido por 7 dias
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* COMO FUNCIONA */}
      <section className="max-w-6xl mx-auto px-4 py-12 border-t border-neutral-900">
        <h2 className="text-center text-xl font-extrabold mb-8 flex justify-center items-center gap-2">
          <HelpCircle className="w-5 h-5 text-purple-500" /> Como funciona a Biel Store?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-900/20 p-6 rounded-2xl border border-neutral-900 space-y-2">
            <span className="text-xl font-black text-purple-500">01</span>
            <h3 className="font-bold text-sm text-neutral-200">Escolha o seu Item</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">Navegue pelas centenas de anúncios criados por vendedores aprovados de diversos jogos.</p>
          </div>
          <div className="bg-neutral-900/20 p-6 rounded-2xl border border-neutral-900 space-y-2">
            <span className="text-xl font-black text-purple-500">02</span>
            <h3 className="font-bold text-sm text-neutral-200">Pague com Segurança</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">O dinheiro do seu pagamento fica retido conosco de forma segura. O vendedor é avisado e inicia a entrega.</p>
          </div>
          <div className="bg-neutral-900/20 p-6 rounded-2xl border border-neutral-900 space-y-2">
            <span className="text-xl font-black text-purple-500">03</span>
            <h3 className="font-bold text-sm text-neutral-200">Receba e Libere</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">Você confere se o produto está correto. Ao confirmar o recebimento, o saldo é retido por 7 dias por segurança e depois liberado ao vendedor.</p>
          </div>
        </div>
      </section>

      {/* REGISTRAR PRODUTO (PARA VENDEDORES) */}
      {session && (session.role === "SELLER" || session.role === "ADMIN") && (
        <section className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-[#0b0c14] border border-emerald-900/30 p-6 rounded-3xl space-y-4 shadow-xl">
            <h2 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
              <PlusCircle className="w-5 h-5" /> Painel de Vendas: Criar Anúncio
            </h2>
            <p className="text-xs text-neutral-400 -mt-2">Crie anúncios atraentes para conquistar novos compradores.</p>

            <form action={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">Título do anúncio</label>
                  <input name="title" placeholder="Ex: Conta Roblox com Blox Fruits" className="w-full bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 text-xs focus:ring-1 focus:ring-purple-500 focus:outline-none" required />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">Jogo/Categoria</label>
                    <input name="category" placeholder="Roblox, Free Fire" className="w-full bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 text-xs focus:ring-1 focus:ring-purple-500 focus:outline-none" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">Preço de Venda</label>
                    <input name="price" type="number" step="0.01" placeholder="R$ 15.00" className="w-full bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 text-xs text-emerald-400 focus:ring-1 focus:ring-purple-500 focus:outline-none" required />
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">Descrição Completa</label>
                <textarea name="description" placeholder="Descreva os itens inclusos na conta, nível de jogo, etc." className="w-full bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 text-xs h-20 focus:ring-1 focus:ring-purple-500 focus:outline-none" required />
              </div>
              <button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 py-3 rounded-xl font-bold text-xs shadow-md transition duration-200">
                Criar Anúncio Oficial
              </button>
            </form>
          </div>
        </section>
      )}

      {/* ========================================================== */}
      {/* PAINEL FLUTUANTE DE DESENVOLVEDOR (FERRAMENTAS DE TESTE) */}
      {/* ========================================================== */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <details className="group bg-neutral-900/20 border border-neutral-800/80 rounded-2xl overflow-hidden transition">
          <summary className="cursor-pointer list-none flex justify-between items-center p-4 select-none font-bold text-xs text-purple-400 hover:bg-neutral-900/50 transition">
            <span className="flex items-center gap-2">
              <FolderSync className="w-4 h-4" /> Painel de Testes do Desenvolvedor (Clique para abrir/fechar)
            </span>
            <span className="transition group-open:rotate-180">▼</span>
          </summary>
          
          <div className="p-6 border-t border-neutral-800/60 bg-neutral-950/80 space-y-6">
            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-start gap-2 text-xs text-amber-300">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold">Aviso de Desenvolvimento</p>
                <p className="mt-0.5 leading-relaxed">Este painel permite que você troque de contas e aprove requisições diretamente pelo seu celular de forma simplificada sem precisar resetar o banco de dados do Railway.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Login do Desenvolvedor */}
              <div className="space-y-3 bg-neutral-900/40 p-4 rounded-xl border border-neutral-800/60">
                <h3 className="text-xs font-black uppercase text-neutral-400">Alternar de Perfil de Teste</h3>
                <form action={handleAuth} className="space-y-2">
                  <input name="name" placeholder="Nome de Teste" defaultValue="Jogador Biel" className="w-full bg-neutral-950 p-2 rounded border border-neutral-800 text-xs" required />
                  <input name="email" type="email" placeholder="E-mail de Teste" defaultValue="cliente@teste.com" className="w-full bg-neutral-950 p-2 rounded border border-neutral-800 text-xs" required />
                  <div className="flex gap-2">
                    <button name="action" value="register" className="flex-1 bg-purple-600 hover:bg-purple-700 py-2 rounded text-xs font-bold transition">Registrar Novo</button>
                    <button name="action" value="login" className="flex-1 bg-neutral-800 hover:bg-neutral-700 py-2 rounded text-xs font-bold transition">Entrar Existente</button>
                  </div>
                </form>
                <p className="text-[10px] text-neutral-500">Use os e-mails de admin (`calvoeditofc@gmail.com` ou `mafiosodashopping@gmail.com`) para obter controle total.</p>
              </div>

              {/* Pedidos de Vendedor pendentes para o Admin aprovar */}
              {session && session.role === "ADMIN" && (
                <div className="space-y-3 bg-neutral-900/40 p-4 rounded-xl border border-neutral-800/60">
                  <h3 className="text-xs font-black uppercase text-amber-400
