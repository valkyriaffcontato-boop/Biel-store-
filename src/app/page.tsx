import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { authenticateMock, requestSellerRole, approveSeller, createProduct, buyProduct, confirmReceived } from "./actions/market";

export default async function HomePage() {
  const session = await getSession();

  // Buscar dados para exibição na interface
  const products = await prisma.product.findMany({
    include: { seller: true }
  });

  const sellerRequests = session?.role === "ADMIN" 
    ? await prisma.sellerRequest.findMany({ where: { status: "PENDING" }, include: { user: true } })
    : [];

  const myOrders = session 
    ? await prisma.order.findMany({ where: { buyerId: session.userId }, include: { product: true } })
    : [];

  // Tratamento dos formulários por Server Actions nativas
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
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      {/* Bloco de Autenticação Rápida */}
      {!session && (
        <section className="bg-neutral-900 p-6 rounded-xl border border-neutral-800">
          <h2 className="text-xl font-bold text-purple-400 mb-4">Acesso Rápido para Testes</h2>
          <form action={handleAuth} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <input name="name" placeholder="Seu Nome" defaultValue="Jogador Biel" className="bg-neutral-950 p-2.5 rounded border border-neutral-800 text-sm" required />
            <input name="email" type="email" placeholder="Seu E-mail" defaultValue="cliente@teste.com" className="bg-neutral-950 p-2.5 rounded border border-neutral-800 text-sm" required />
            <div className="flex gap-2">
              <button name="action" value="register" className="flex-1 bg-purple-600 hover:bg-purple-700 py-2.5 rounded text-sm font-bold">Registrar</button>
              <button name="action" value="login" className="flex-1 bg-neutral-800 hover:bg-neutral-700 py-2.5 rounded text-sm font-bold">Entrar</button>
            </div>
          </form>
          <p className="text-xs text-neutral-500 mt-3">Dica: Use os e-mails dos proprietários para testar o painel administrativo.</p>
        </section>
      )}

      {/* Seção Quero Vender */}
      {session && session.role === "USER" && (
        <section className="bg-neutral-900 p-6 rounded-xl border border-neutral-800">
          <h2 className="text-xl font-bold text-purple-400 mb-2">💡 Quero Vender na BIEL STORE</h2>
          <p className="text-sm text-neutral-400 mb-4">Envie sua solicitação para receber autorização e anunciar seus produtos.</p>
          <form action={handleRequestSeller} className="space-y-4 max-w-lg">
            <input name="fullName" placeholder="Nome Completo" className="w-full bg-neutral-950 p-2 rounded border border-neutral-800 text-sm" required />
            <div className="grid grid-cols-2 gap-2">
              <input name="cpf" placeholder="CPF" className="bg-neutral-950 p-2 rounded border border-neutral-800 text-sm" required />
              <input name="whatsapp" placeholder="WhatsApp" className="bg-neutral-950 p-2 rounded border border-neutral-800 text-sm" required />
            </div>
            <input name="games" placeholder="Jogos que você vende (ex: Roblox, Free Fire)" className="w-full bg-neutral-950 p-2 rounded border border-neutral-800 text-sm" required />
            <textarea name="experience" placeholder="Conte-nos sobre sua experiência..." className="w-full bg-neutral-950 p-2 rounded border border-neutral-800 text-sm h-20" required />
            <button className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-sm font-bold transition">Enviar Pedido</button>
          </form>
        </section>
      )}

      {/* Painel Administrativo */}
      {session && session.role === "ADMIN" && sellerRequests.length > 0 && (
        <section className="bg-amber-950/20 border border-amber-900 p-6 rounded-xl">
          <h2 className="text-xl font-bold text-amber-400 mb-4">🛡️ Solicitações de Vendedor Pendentes</h2>
          <div className="space-y-4">
            {sellerRequests.map((req) => (
              <div key={req.id} className="bg-neutral-900 p-4 rounded border border-neutral-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="font-bold text-sm">{req.fullName} ({req.user.email})</p>
                  <p className="text-xs text-neutral-400 mt-1">Jogos: {req.games} | Exp: {req.experience}</p>
                </div>
                <form action={async () => { "use server"; await approveSeller(req.id); }}>
                  <button className="bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded text-xs font-bold">Aprovar Vendedor</button>
                </form>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Painel de Cadastro de Itens (Vendedores e Admins) */}
      {session && (session.role === "SELLER" || session.role === "ADMIN") && (
        <section className="bg-neutral-900 p-6 rounded-xl border border-neutral-800">
          <h2 className="text-xl font-bold text-emerald-400 mb-4">🚀 Criar Novo Anúncio</h2>
          <form action={handleAddProduct} className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <input name="title" placeholder="Título do Anúncio" className="bg-neutral-950 p-2.5 rounded border border-neutral-800 text-sm" required />
            <input name="category" placeholder="Categoria (ex: Roblox)" className="bg-neutral-950 p-2.5 rounded border border-neutral-800 text-sm" required />
            <input name="price" type="number" step="0.01" placeholder="Preço (R$)" className="bg-neutral-950 p-2.5 rounded border border-neutral-800 text-sm" required />
            <input name="description" placeholder="Descrição rápida" className="bg-neutral-950 p-2.5 rounded border border-neutral-800 text-sm" required />
            <button className="sm:col-span-4 bg-emerald-600 hover:bg-emerald-700 py-2.5 rounded font-bold text-sm">Publicar Itens</button>
          </form>
        </section>
      )}

      {/* Grid de Produtos */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-neutral-100">Catálogo de Itens</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div key={p.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs bg-purple-900/50 text-purple-300 px-2.5 py-1 rounded font-semibold">{p.category}</span>
                <h3 className="text-lg font-bold mt-2">{p.title}</h3>
                <p className="text-sm text-neutral-400 line-clamp-2 mt-1">{p.description}</p>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-xl font-black text-emerald-400">R$ {p.price.toFixed(2)}</span>
                <form action={async () => { "use server"; await buyProduct(p.id); }}>
                  <button className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-xs font-bold transition">Comprar</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Compras efetuadas / Sistema de Intermediação */}
      {session && myOrders.length > 0 && (
        <section className="bg-neutral-900 p-6 rounded-xl border border-neutral-800">
          <h2 className="text-xl font-bold text-indigo-400 mb-4">Minhas Compras (Intermediação de Saldo)</h2>
          <div className="space-y-4">
            {myOrders.map((order) => (
              <div key={order.id} className="bg-neutral-950 p-4 rounded border border-neutral-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="font-bold text-sm">{order.product.title}</p>
                  <p className="text-xs text-neutral-400">Preço: R$ {order.amount.toFixed(2)} | Status: <span className="font-bold text-yellow-500">{order.status}</span></p>
                </div>
                {order.status === "PAID" && (
                  <form action={async () => { "use server"; await confirmReceived(order.id); }}>
                    <button className="bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded text-xs font-bold">Marcar como Recebido</button>
                  </form>
                )}
                {order.status === "COMPLETED" && (
                  <span className="text-xs text-neutral-500 font-bold bg-neutral-900 px-2.5 py-1 rounded">Saldo Liberado em 7 dias</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
        }
