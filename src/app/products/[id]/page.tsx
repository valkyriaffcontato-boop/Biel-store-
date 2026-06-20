import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { ShieldCheck, ArrowLeft, Gamepad, HelpCircle, BadgeCheck } from "lucide-react";
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

  const isOwner = session?.userId === product.sellerId;
  const isAdmin = session?.role === "ADMIN";
  if (product.status !== "active" && !isOwner && !isAdmin) notFound();

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

              {/* BOTAO COMPRAR LEVA PARA A TELA DE CHECKOUT/PAGAMENTO */}
              <Link href={`/checkout/${product.id}`} className="w-full block text-center bg-[#00e676] hover:bg-emerald-400 text-black font-black py-4 rounded-2xl text-xs transition duration-200 shadow-xl shadow-[#00e676]/10">
                Comprar agora (Entrega garantida)
              </Link>

              <div className="flex items-start gap-2 text-[10px] text-neutral-400 bg-neutral-900/40 p-3 rounded-xl border border-neutral-850">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>O vendedor receberá o pagamento somente após você confirmar a entrega e funcionamento do item.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
