import { prisma } from "@/lib/prisma";
import { buyProduct, createQuestion, answerQuestion } from "@/app/actions/market";
import { getSession } from "@/lib/session";
import { ShieldCheck, ArrowLeft, Gamepad, HelpCircle, BadgeCheck, MessageSquare } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  const resolvedParams = await params;
  const product = await prisma.product.findUnique({
    where: { id: resolvedParams.id },
    include: { 
      seller: true,
      questions: { include: { user: true }, orderBy: { createdAt: "desc" } }
    }
  });

  if (!product) notFound();

  async function handlePurchase() {
    "use server";
    if (!product) return;
    await buyProduct(product.id);
  }

  async function handleAsk(formData: FormData) {
    "use server";
    const text = formData.get("questionText") as string;
    if (product) await createQuestion(product.id, text);
  }

  return (
    <div className="min-h-screen bg-[#080a10] text-white py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link href="/" className="text-xs text-neutral-400 hover:text-white flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Voltar para a vitrine
        </Link>

        {/* PRODUTO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-neutral-900/30 border border-neutral-800 rounded-3xl p-6 shadow-2xl">
          <div className="aspect-square bg-neutral-950 rounded-2xl border border-neutral-800 flex items-center justify-center overflow-hidden">
            {product.image ? (
              <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <Gamepad className="w-12 h-12 text-neutral-800" />
            )}
          </div>

          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="text-[9px] uppercase font-bold bg-[#00e676]/10 text-[#00e676] px-2.5 py-1 rounded-full border border-[#00e676]/20">
                {product.category}
              </span>
              <h1 className="text-xl md:text-2xl font-black leading-snug">{product.title}</h1>
              <p className="text-xs text-neutral-400 leading-relaxed">{product.description}</p>
            </div>

            <div className="space-y-4 pt-4 border-t border-neutral-850">
              <div className="flex justify-between items-center bg-neutral-950 p-4 rounded-2xl border border-neutral-850">
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Valor do item</p>
                  <p className="text-2xl font-black text-[#00e676]">R$ {product.price.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-neutral-500 uppercase">Vendedor</p>
                  <p className="text-xs font-bold text-neutral-200 flex items-center gap-1">
                    @{product.seller.name} 
                    {product.seller.isVerified && <BadgeCheck className="w-3.5 h-3.5 text-blue-400" />}
                  </p>
                </div>
              </div>

              <form action={handlePurchase}>
                <button className="w-full bg-[#00e676] hover:bg-emerald-400 text-black font-black py-4 rounded-2xl text-xs transition duration-200 shadow-xl shadow-[#00e676]/10">
                  Comprar agora (Entrega garantida)
                </button>
              </form>

              <div className="flex items-start gap-2 text-[10px] text-neutral-400 bg-neutral-900/40 p-3 rounded-xl border border-neutral-850">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>O vendedor receberá o pagamento somente após você confirmar a entrega e funcionamento do item.</span>
              </div>
            </div>
          </div>
        </div>

        {/* SEÇÃO PERGUNTAS E RESPOSTAS (IGUAL GG MAX) */}
        <div className="bg-neutral-900/30 border border-neutral-800 rounded-3xl p-6 space-y-6">
          <h2 className="text-sm font-black text-neutral-200 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-400" /> Perguntas ao vendedor
          </h2>

          {/* Enviar Pergunta */}
          <form action={handleAsk} className="flex gap-2">
            <input 
              name="questionText" 
              placeholder="Faça uma pergunta sobre o estoque, nível da conta, etc..." 
              className="flex-1 bg-neutral-950 p-3 rounded-xl border border-neutral-850 text-xs focus:ring-1 focus:ring-purple-500 focus:outline-none" 
              required 
            />
            <button className="bg-neutral-800 hover:bg-neutral-700 font-bold text-xs px-4 rounded-xl transition">
              Perguntar
            </button>
          </form>

          {/* Lista de Perguntas */}
          <div className="space-y-4 pt-2">
            {product.questions.length === 0 ? (
              <p className="text-xs text-neutral-500 text-center py-4">Nenhuma pergunta feita até o momento. Seja o primeiro!</p>
            ) : (
              product.questions.map((q) => (
                <div key={q.id} className="bg-neutral-950 p-4 rounded-2xl border border-neutral-850 space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-500 text-[10px]">
                    <span>@{q.user.name} perguntou:</span>
                    <span>Hoje</span>
                  </div>
                  <p className="font-semibold text-neutral-200">{q.text}</p>
                  
                  {/* Resposta do Vendedor */}
                  {q.answer ? (
                    <div className="bg-neutral-900/60 p-3 rounded-xl border border-neutral-800/80 mt-2 space-y-1">
                      <p className="text-[10px] text-emerald-400 font-bold uppercase">Resposta do Vendedor:</p>
                      <p className="text-neutral-300">{q.answer}</p>
                    </div>
                  ) : (
                    session?.userId === product.sellerId && (
                      <form action={async (formData) => {
                        "use server";
                        const answer = formData.get("answerText") as string;
                        await answerQuestion(q.id, answer, product.id);
                      }} className="flex gap-2 mt-2">
                        <input name="answerText" placeholder="Responder esta pergunta..." className="flex-1 bg-neutral-900 p-2 rounded-lg border border-neutral-800 text-[11px]" required />
                        <button className="bg-emerald-600 hover:bg-emerald-500 text-[10px] font-bold px-3 rounded-lg">Responder</button>
                      </form>
                    )
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
